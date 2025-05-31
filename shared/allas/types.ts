export type AllasFile = {
  Key?: string;
  LastModified?: Date;
  ETag?: string;
  Size?: number;
  StorageClass?: string;
};

export type AllasBucket = {
  name: string;
  files?: AllasFile[];
};
