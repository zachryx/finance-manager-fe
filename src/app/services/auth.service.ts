import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private apollo: Apollo) {}

  login(email: string, password: string, rememberMe: boolean = false) {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation Login($email: String!, $password: String!, $rememberMe: Boolean!) {
            login(loginInput: { email: $email, password: $password, remember_me: $rememberMe }) {
              user {
                id
                name
                email
              }
              tokens {
                access_token
                refresh_token
              }
            }
          }
        `,
        variables: { email, password, rememberMe },
      })
      .pipe(map((result: any) => result.data?.login));
  }

  register(name: string, email: string, password: string) {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation Register($name: String!, $email: String!, $password: String!) {
            register(registerInput: { name: $name, email: $email, password: $password }) {
              id
              name
              email
            }
          }
        `,
        variables: { name, email, password },
      })
      .pipe(map((result: any) => result.data?.register));
  }

  forgotPassword(email: string) {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation ForgotPassword($email: String!) {
            forgotPassword(forgotPassword: { email: $email }) {
              message
            }
          }
        `,
        variables: { email },
      })
      .pipe(map((result: any) => result.data?.forgotPassword));
  }

  saveTokens(tokens: { access_token: string; refresh_token?: string }) {
    localStorage.setItem('access_token', tokens.access_token);
    if (tokens.refresh_token) {
      localStorage.setItem('refresh_token', tokens.refresh_token);
    }
  }

  getAccessToken() {
    return localStorage.getItem('access_token');
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}
