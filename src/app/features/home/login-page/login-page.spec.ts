import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginPage } from './login-page';
import { Router } from '@angular/router'

// const routerMock = {
//   navigate: jest.fn()
// };

describe('LoginPage (Jest)', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginPage],
      // providers: [
      //   { provide: Router, useValue: routerMock }
      // ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve exibir erro quando o formulário for inválido', () => {
    component.submit();

    expect(component.errorMessage()).toBe('Email/senha inválidos');
    expect(component.isLoading()).toBeFalsy();
    // expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('deve invalidar email incorreto', () => {
    component.loginForm.setValue({
      email: 'email-invalido',
      password: '123456'
    });

    expect(component.loginForm.invalid).toBeTruthy();
  });


});
