import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';

// Define validation schema using Zod
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

// Infer the type from the schema
type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize react-hook-form with zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Handle form submission
  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
      <CardHeader>
        <CardTitle className="text-slate-900 dark:text-slate-50">Sign In</CardTitle>
        <CardDescription className="text-slate-500 dark:text-slate-400">Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm p-3 rounded-md">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              className="border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50"
              {...register('email')}
              aria-invalid={errors.email ? 'true' : 'false'}
            />
            {errors.email && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Password
              </label>
              <a
                href="/forgot-password"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Forgot password?
              </a>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50"
              {...register('password')}
              aria-invalid={errors.password ? 'true' : 'false'}
            />
            {errors.password && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </Button>
          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            Don't have an account?{' '}
            <a href="/register" className="text-blue-600 dark:text-blue-400 hover:underline">
              Create an account
            </a>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
};

export default LoginForm;
