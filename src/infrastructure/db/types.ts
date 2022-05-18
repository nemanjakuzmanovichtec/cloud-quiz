import { AnyObj } from '@utils/types';

export interface WhereCondition {
  primaryKey: string;
  primaryKeyValue: string;
  secondaryKey: string;
  secondaryKeyValue: string;
}

export interface Metadata {
  tableName: string;
}

export interface Database {
  findOne: (
    params: WhereCondition,
    metadata: Metadata
  ) => Promise<AnyObj | void>;
  save: <T>(data: T, metadata: Metadata) => Promise<T | AnyObj | void>;
  remove: (data: WhereCondition, metadata: Metadata) => Promise<AnyObj | void>;
}
