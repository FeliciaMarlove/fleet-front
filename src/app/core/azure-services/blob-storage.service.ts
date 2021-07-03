import { Injectable } from '@angular/core';
import { BlobServiceClient } from '@azure/storage-blob';

export enum BLOB_GOAL {
  INSPECTION_IMAGE,
  INSPECTION_REPORT,
  LOG
}

const account = 'tfefleetstorage';
const sas = 'sp=racwl&st=2021-06-29T16:40:28Z&se=2021-12-31T01:40:28Z&sv=2020-02-10&sr=c&sig=G6uhwfORW%2BanRC1szwArLSg5SZf%2BD5IWT%2BNDpybQHaI%3D';
const URL = 'https://tfefleetstorage.blob.core.windows.net/';

@Injectable({
  providedIn: 'root'
})

export class BlobStorageService {

  constructor() { }

  /**
   * Write block blog to Azure storage and return the url of the saved file
   * @param containerName Name of the existing Azure container
   * @param goal The type of file as per internal classification
   * @param file The file to store
   */
  public async writeAzureBlockBlob(containerName: string, goal: BLOB_GOAL, file: File): Promise<string> {
      const extension = file.name.split('.').pop();
      const blobServiceClient = new BlobServiceClient(`https://${account}.blob.core.windows.net/${containerName}?${sas}`);
      const folderName = new Date().getFullYear();
      const containerClient = blobServiceClient.getContainerClient(folderName.toString());
      const blobName = BLOB_GOAL[goal] + '_' + +new Date() + '.' + extension;
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);
      const uploadResponse = await blockBlobClient.upload(file, file.size);
      return URL + containerName + '/' + folderName + '/' + blobName;
  }
}
