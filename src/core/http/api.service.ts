// core/http/api.service.ts
@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  get(url: string) {
    return this.http.get(`${this.baseUrl}${url}`);
  }

  post(url: string, body: any) {
    return this.http.post(`${this.baseUrl}${url}`, body);
  }

  patch(url: string, body: any) {
    return this.http.patch(`${this.baseUrl}${url}`, body);
  }
}
