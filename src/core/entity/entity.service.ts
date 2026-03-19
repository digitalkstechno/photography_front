import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../http/api.service';
import { EntityConfig } from './entity.types';

@Injectable({ providedIn: 'root' })
export class EntityService {

  constructor(private api: ApiService) {}

  /**
   * Extract data from wrapped response { success, data } or return raw array
   */
  private unwrap(response: any): any {
    if (response && typeof response === 'object' && 'data' in response) {
      return response.data;
    }
    return response;
  }

  async list(entity: EntityConfig, params?: any): Promise<any> {
    const url = entity.listApi ?? entity.api;
    const res = await firstValueFrom(this.api.get<any>(url, params));
    return this.unwrap(res);
  }

  async getOne(entity: EntityConfig, id: string): Promise<any> {
    const res = await firstValueFrom(this.api.get<any>(`${entity.api}/${id}`));
    return this.unwrap(res);
  }

  async create(entity: EntityConfig, data: any): Promise<any> {
    const res = await firstValueFrom(this.api.post<any>(entity.api, data));
    return this.unwrap(res);
  }

  async update(entity: EntityConfig, id: string, data: any): Promise<any> {
    const res = await firstValueFrom(this.api.put<any>(`${entity.api}/${id}`, data));
    return this.unwrap(res);
  }

  async remove(entity: EntityConfig, id: string): Promise<any> {
    const res = await firstValueFrom(this.api.delete<any>(`${entity.api}/${id}`));
    return this.unwrap(res);
  }
}
