import { promisify }from 'util';

import sha1 from 'sha1';

import { v4 as uuid4 } from 'uuid';

import dbClient from '../utils/db';

import redisClient from '../utils/redis';

const { ObjectId } = require('mongodb');

const { mkdir, writeFile } = require('fs');

const { join } = require('path');
const mkdirAsync = promisify(mkdir);
const writeFileAsync = promisify(writeFile);
const folderPath = process.env.FOLDER_PATH;
const storageFolder = folderPath && folderPath.length > 0 ? folderPath : '/tmp/files_manager';

class FilesController {
  static async postUpload(request, response) {
    const token = request.headers['x-token'];
    const userId = await redisClient.get(`auth_${token}`);
    if (userId) {
      const user = await dbClient.findUser({ _id: ObjectId(userId) });
	const { name, type, data, isPublic, parentId } = request.body;
	let isPublicDefault, parentIdDefault;
	isPublic === undefined ? isPublicDefault = false : isPublicDefault = isPublic;
	parentId === undefined ? parentIdDefault = 0 : parentIdDefault = ObjectId(parentId);
	const arr = [name, type, data, isPublicDefault, parentIdDefault];
	if (!name) return response.status(400).json({ error: 'Missing name' });
	if (!type || !['folder', 'file', 'image'].includes(type)) return response.status(400).json({ error: 'Missing type' });
	if (!data && type !== 'folder') return response.status(400).json({ error: 'Missing data' });
	if (parentIdDefault !== 0) {
	    const file = await dbClient.findFile({ _id: parentIdDefault });
	    if (!file) return response.status(400).json({ error: 'Parent not found' });
	    if (file.type !== 'folder') return response.status(400).json({ error: 'Parent is not a folder' });
	}
	const newFile = {
	    userId: ObjectId(userId),
	    name,
	    type,
	    isPublic: isPublicDefault,
	    parentId: parentIdDefault,
	};
	await mkdirAsync(storageFolder, { recursive: true });
	if (type !== 'folder') {
	    const localPath = join(storageFolder, uuid4());
	    await writeFileAsync(localPath, Buffer.from(data, 'base64'));
	    newFile.localPath = localPath;
	}
	const saveFile = await dbClient.addFile(newFile);
	const fileId = saveFile.insertedId;
	const resData = {
	    id: fileId,
	    userId,
	    name,
	    type,
	    isPublic: isPublicDefault,
	    parentId: parentIdDefault,
	};

	return response.json(resData);
    }
    return response.status(401).json({ error: 'Unauthorized' });
  }
}
module.exports = FilesController;
