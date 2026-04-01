import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import { logout as logoutAction, setCredentials } from '../store/authSlice';
import { useLoginMutation, useRegisterMutation, authApi } from '../store/authApi';

export function useAuth() {
    const dispatch = useDispatch<AppDispatch>();
    const { user, token, loading } = useSelector((state: RootState) => state.auth);

    const [loginMutation] = useLoginMutation();
    const [registerMutation] = useRegisterMutation();

    const login = async (email: string, password: string) => {
        const data = await loginMutation({ email, password }).unwrap();
        dispatch(setCredentials(data));
    };

    const register = async (name: string, email: string, password: string, passwordConfirmation: string) => {
        const data = await registerMutation({
            name, email, password,
            password_confirmation: passwordConfirmation,
        }).unwrap();
        dispatch(setCredentials(data));
    };

    const logout = () => {
        sessionStorage.removeItem('skip_onboarding');
        dispatch(logoutAction());
        dispatch(authApi.util.resetApiState());
    };

    return { user, token, loading, login, register, logout };
}
