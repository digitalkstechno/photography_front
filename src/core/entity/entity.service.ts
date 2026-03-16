import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../http/api.service';
import { EntityConfig } from './entity.types';

@Injectable({ providedIn: 'root' })
export class EntityService {

  constructor(private api: ApiService) {}

  list(entity: EntityConfig, params?: any): Promise<any> {
    const url = entity.listApi ?? entity.api;
    return firstValueFrom(this.api.get<any>(url, params));
  }

  getOne(entity: EntityConfig, id: string): Promise<any> {
    return firstValueFrom(this.api.get<any>(`${entity.api}/${id}`));
  }

  create(entity: EntityConfig, data: any): Promise<any> {
    return firstValueFrom(this.api.post<any>(entity.api, data));
  }

  update(entity: EntityConfig, id: string, data: any): Promise<any> {
    return firstValueFrom(this.api.put<any>(`${entity.api}/${id}`, data));
  }

  remove(entity: EntityConfig, id: string): Promise<any> {
    return firstValueFrom(this.api.delete<any>(`${entity.api}/${id}`));
  }
}
