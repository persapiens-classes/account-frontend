import { Entry, EntryType } from './entry';
import { ModelListService, loadModels } from '../models/model-list-service';
import { WritableSignal } from '@angular/core';
import { AppMessageService } from '../app-message-service';
import { API_PATHS } from '../app.api-paths';

export class EntryListService implements ModelListService<Entry> {
  constructor(
    private readonly appMessageService: AppMessageService,
    private readonly type: EntryType,
  ) {}

  findAll(): WritableSignal<Entry[]> {
    return loadModels(
      this.appMessageService,
      `${this.type} Entry`,
      `${this.type.toLowerCase()}${API_PATHS.ENTRY_API_PATH}`,
    );
  }
}
