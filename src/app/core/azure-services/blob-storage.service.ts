import { Injectable } from '@angular/core';
import {BlobServiceClient} from '@azure/storage-blob';

export enum BLOB_GOAL {
  INSPECTION_IMAGE,
  INSPECTION_REPORT,
  LOG
}

const account = 'tfefleetstorage';
const inspectionSAS = 'sp=racwl&st=2021-06-29T16:40:28Z&se=2021-12-31T01:40:28Z&sv=2020-02-10&sr=c&sig=G6uhwfORW%2BanRC1szwArLSg5SZf%2BD5IWT%2BNDpybQHaI%3D';
const URL = 'https://tfefleetstorage.blob.core.windows.net/';
const logSAS = 'sp=racwl&st=2021-07-05T14:03:44Z&se=2021-11-30T23:03:44Z&sv=2020-02-10&sr=c&sig=kPCvWMaR4VAeIwHlFmbg9rVPFYG59vpD5T3r%2BESNzNg%3D';
const accountSAS = 'WxW7nXPlyPLNgkLbHvmqrTVDyhqZc4qZmcikoG6rHfvWBcN5F9eP95bIY46FimZuwVWpbzBdI+/0aCVJw1wsEw==';
const connectionString = 'DefaultEndpointsProtocol=https;AccountName=tfefleetstorage;AccountKey=WxW7nXPlyPLNgkLbHvmqrTVDyhqZc4qZmcikoG6rHfvWBcN5F9eP95bIY46FimZuwVWpbzBdI+/0aCVJw1wsEw==;EndpointSuffix=core.windows.net';

@Injectable({
  providedIn: 'root'
})

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
