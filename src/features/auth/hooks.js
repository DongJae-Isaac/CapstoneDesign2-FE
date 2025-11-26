import { useMutation } from '@tanstack/react-query';
import { signup, login } from './api';

/**
 * 회원가입 훅
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export function useSignup() {
  return useMutation({
    mutationFn: signup,
  });
}

/**
 * 로그인 훅
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export function useLogin() {
  return useMutation({
    mutationFn: login,
  });
}
