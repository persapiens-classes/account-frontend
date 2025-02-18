import { Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Owner } from "./owner";
import { lastValueFrom } from "rxjs";
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OwnerService {

  private apiUrl = environment.apiUrl + '/owners';
  private _owners = signal<Owner[]>([]); // Signal to store owners

  constructor(private http: HttpClient) {
    this.loadOwners(); // Load owners at startup
  }

  /** Insert new Owner using API e update signal */
  async insert(bean: Owner): Promise<Owner | null> {
    try {
      const newOwner = await lastValueFrom(this.http.post<Owner>(this.apiUrl, bean))
      if (newOwner) {
        this._owners.set([...this._owners(), newOwner])
      }
      return newOwner ?? null
    } catch (error) {
      console.error("Error inserting Owner:", error)
      return null
    }
  }

  /** Remove Owner using API e update signal */
  async remove(id: string): Promise<boolean> {
    try {
      await lastValueFrom(this.http.delete(`${this.apiUrl}/${id}`))
      this._owners.set(this._owners().filter(owner => owner.name !== id))
      return true
    } catch (error) {
      console.error("Error removing Owner:", error)
      return false
    }
  }

  /** Update Owner using API e update signal */
  async update(id: string, bean: Owner): Promise<Owner | null> {
    try {
      const updatedOwner = await lastValueFrom(this.http.put<Owner>(`${this.apiUrl}/${id}`, bean))
      if (updatedOwner) {
        this._owners.set(this._owners().map(owner => (owner.name === id ? updatedOwner : owner)))
      }
      return updatedOwner ?? null
    } catch (error) {
      console.error("Error updating Owner:", error)
      return null
    }
  }

  /** Find Owners using API e update signal */
  public async loadOwners() {
    try {
      const owners = await lastValueFrom(this.http.get<Owner[]>(this.apiUrl))
      if (owners) {
        this._owners.set(owners)
      }
    } catch (error) {
      console.error("Error loading Owners:", error)
    }
  }

  /** Returns list of Owners using Signal */
  get owners() {
    return this._owners
  }

  /** Find Owner by ID */
  async findById(id: string): Promise<Owner | null> {
    try {
      return await lastValueFrom(this.http.get<Owner>(`${this.apiUrl}/${id}`)) ?? null
    } catch (error) {
      console.error("Error find Owner:", error)
      return null
    }
  }
}
