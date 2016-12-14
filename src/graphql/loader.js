import * as fs from 'fs';
import glob from 'glob';

export const loadGqlSchema = function(pattern) {
  return new Promise(async(resolve, reject) => {
    try {
      const files = await getGlob(pattern);
      const schemaFile = await makeSchema(files);
      resolve(schemaFile);
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * @param  {String} pattern
 * @return {Promise}
 */
function getGlob(pattern) {
  return new Promise((resolve, reject) => {
    glob(pattern, (err, files) => {
      if (err || files.length === 0) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  });
}

/**
 * @param  {Array} fileNames
 * @return {Promise}
 */
function makeSchema(fileNames) {
  const promises = fileNames.map(readFile);
  return Promise.all(promises).then((fileContentArr) => {
    return fileContentArr.join();
  }).catch((err) => {
    throw err;
  });
}

/**
 * @param  {String} fileName
 * @return {Promise}
 */
function readFile(fileName) {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}
