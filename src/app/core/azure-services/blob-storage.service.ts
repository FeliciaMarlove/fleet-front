import { Injectable } from '@angular/core';
import { BlobServiceClient } from '@azure/storage-blob';
import {KeyValuePipe} from '@angular/common';

@Injectable({
  providedIn: 'root'
})

const account = 'tfefleetstorage';
const sas = 'sp=racwl&st=2021-06-29T16:40:28Z&se=2021-12-31T01:40:28Z&sv=2020-02-10&sr=c&sig=G6uhwfORW%2BanRC1szwArLSg5SZf%2BD5IWT%2BNDpybQHaI%3D';
const URL = 'https://tfefleetstorage.blob.core.windows.net/';

export enum BLOB_GOAL {
  INSPECTION_IMAGE,
  INSPECTION_REPORT,
  LOG
}

export class BlogStorageService {

  constructor() { }

  /**
   *
   * @param containerName
   * @param goal
   * @param name
   */
  public async writeAzureBlob(containerName: string, goal: BLOB_GOAL, name: string, file): Promise<string> {
    try {
      const extension = this.checkAndGetFileExtension();
      const blobServiceClient = new BlobServiceClient(`https://${account}.blob.core.windows.net/${containerName}?${sas}`);
      const folderName = new Date().getFullYear();
      const containerClient = blobServiceClient.getContainerClient(folderName.toString());
      const blobName = goal.toString() + name + +new Date() + extension;
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);
      const uploadResponse = await blockBlobClient.upload(file, file.size);
      return URL + containerName + '/' + folderName + '/' + blobName;
    } catch (e) {
      return 'ERROR' + e;
    }
  }

  private checkAndGetFileExtension() {

  }
}
