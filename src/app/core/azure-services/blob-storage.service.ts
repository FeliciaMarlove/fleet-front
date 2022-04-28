import { Injectable } from '@angular/core';
import {BlobServiceClient} from '@azure/storage-blob';

export enum BLOB_GOAL {
  INSPECTION_IMAGE,
  INSPECTION_REPORT,
  LOG
}

// TODO use an external variables file
const account = '<STORAGE_ACCOUNT>';
const inspectionSAS = '<SECRET>';
const URL = 'https://<STORAGE_ACCOUNT>.blob.core.windows.net/';
const logSAS = '<SECRET>';
const accountSAS = '<SECRET>';
const connectionString = 'DefaultEndpointsProtocol=https;AccountName=tfefleetstorage;AccountKey=<SECRET>;EndpointSuffix=core.windows.net';

@Injectable({
  providedIn: 'root'
})

/**
 * Expose methods to handle blob objects on Azure storage
 */
export class BlobStorageService {

  constructor() { }

  /**
   * Write block blob to Azure storage and return the url of the saved file
   * @param containerName Name of the existing Azure container
   * @param goal The type of file as per internal classification
   * @param file The file to store
   */
  public async writeAzureBlockBlob(containerName: string, goal: BLOB_GOAL, file: File): Promise<string> {
      const extension = file.name.split('.').pop();
      const blobServiceClient = new BlobServiceClient(`https://${account}.blob.core.windows.net/${containerName}?${inspectionSAS}`);
      const folderName = new Date().getFullYear();
      const containerClient = blobServiceClient.getContainerClient(folderName.toString());
      const blobName = BLOB_GOAL[goal] + '_' + +new Date() + '.' + extension;
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);
      const uploadResponse = await blockBlobClient.upload(file, file.size);
      return URL + containerName + '/' + folderName + '/' + blobName;
  }

  /**
   * Write append blob to Azure storage log file
   * Makes one retry in case of failure
   * @param log The message to log
   */
  public async writeAzureLogBlob(log: string) {
    log = '\nCLIENT SIDE:::' + new Date().toISOString() + ':::' + log;
    let attempt = 1;
    const containerName = 'logs';
    const blobName = 'logs.txt';
    const blobServiceClient = new BlobServiceClient(`https://${account}.blob.core.windows.net?${logSAS}`);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const appendBlob = containerClient.getAppendBlobClient(blobName);

    const uploadResponse = await appendBlob.appendBlock(log, log.length);
    if (uploadResponse._response.status !== 201 && attempt < 2) {
      attempt++;
      await this.writeAzureLogBlob(log);
    }
  }
}
