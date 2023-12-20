import { promisify } from 'util';

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
      const {
        name, type, data, isPublic, parentId,
      } = request.body;
      let isPublicDefault;
      let parentIdDefault;
      if (isPublic === undefined) {
        isPublicDefault = false;
      } else {
        isPublicDefault = isPublic;
      }
      if (parentId === undefined) {
        parentIdDefault = 0;
      } else {
        parentIdDefault = ObjectId(parentId);
      }
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

  static async getShow(request, response) {
	  const { id } = request.params;
	  const token = request.headers['x-token'];
	  const userId = await redisClient.get(`auth_${token}`);
	  if (userId) {
	    const file = await dbClient.findFile({ _id: ObjectId(id) });
	    if (file._id.toString() === id) {
		    const resData = {
		      id: file._id.toString(),
		      userId,
		      name: file.name,
		      type: file.type,
		      isPublic: file.isPublic,
		      parentId: file.parentId,
		    };
		    return response.status(200).json(resData);
	    }
	    return response.status(404).json({ error: 'Not found' });
	  }
	  return response.status(401).json({ error: 'Unauthorized' });
  }

  static async getIndex(request, response) {
	  const parentId = request.query.parentId ? request.query.parentId : 0;
	  const page = request.query.page ? request.query.page : 0;
	  const token = request.headers['x-token'];
	  const userId = await redisClient.get(`auth_${token}`);
	  if (userId) {
	    let matchCriteria;
	    if (parentId !== 0) {
		    matchCriteria = {
		      parentId: parentId ? ObjectId(parentId): 0,
		    }
	    } else {
		    matchCriteria = {
		      userId: ObjectId(userId),
		    }
	    }
	    const skip = page * 20;
	    const pipeline = [
		    { $match: matchCriteria },
		    { $skip: skip },
        { $sort: { _id : -1 } },
		    { $limit: 20 },
		    { $project:
		      {
            id: '$_id',
            _id: 0,
		        userId: 1,
		        name: 1,
		        type: 1,
		        isPublic: 1,
		        parentId: 1,
		      },
		    },
	    ];
	    const result = await dbClient.getAggregate(pipeline);
      return response.status(200).json(result);
	  }
	  return response.status(401).json({ error: 'Unauthorized' });
  }

}
module.exports = FilesController;
