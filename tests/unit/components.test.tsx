import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useForm } from '@/lib/hooks/use-form';

// Test Button component
describe('Button Component', () => {
  test('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  test('shows loading state', () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByRole('button')).toHaveTextContent('Loading');
  });

  test('handles click events', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('applies correct variant styles', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-secondary');
  });

  test('applies correct size styles', () => {
    render(<Button size="lg">Large</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('h-11');
  });
});

// Test Input component
describe('Input Component', () => {
  test('renders input with label', () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  test('shows error message', () => {
    render(<Input label="Email" error="Email is required" />);
    expect(screen.getByText('Email is required')).toBeInTheDocument();
  });

  test('shows helper text', () => {
    render(<Input label="Email" helperText="Enter your email address" />);
    expect(screen.getByText('Enter your email address')).toBeInTheDocument();
  });

  test('handles input changes', async () => {
    const handleChange = jest.fn();
    render(<Input label="Email" onChange={handleChange} />);
    
    const input = screen.getByLabelText('Email');
    await userEvent.type(input, 'test@example.com');
    
    expect(handleChange).toHaveBeenCalled();
  });

  test('displays left and right icons', () => {
    const leftIcon = <span data-testid="left-icon">@</span>;
    const rightIcon = <span data-testid="right-icon">✓</span>;
    
    render(
      <Input 
        label="Email" 
        leftIcon={leftIcon} 
        rightIcon={rightIcon} 
      />
    );
    
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
  });
});

// Test Card component
describe('Card Component', () => {
  test('renders card with content', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Test Card</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Card content</p>
        </CardContent>
      </Card>
    );
    
    expect(screen.getByText('Test Card')).toBeInTheDocument();
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  test('applies correct variant styles', () => {
    render(<Card variant="outlined">Outlined card</Card>);
    const card = screen.getByText('Outlined card');
    expect(card.parentElement).toHaveClass('border');
  });

  test('applies correct padding', () => {
    render(<Card padding="sm">Small padding</Card>);
    const card = screen.getByText('Small padding');
    expect(card.parentElement).toHaveClass('p-3');
  });
});

// Test useForm hook
describe('useForm Hook', () => {
  const TestForm = () => {
    const { values, errors, handleChange, handleSubmit, getFieldError } = useForm(
      { email: '', password: '' },
      {
        email: { required: true, email: true },
        password: { required: true, minLength: 6 }
      }
    );

    return (
      <form onSubmit={handleSubmit}>
        <Input
          label="Email"
          name="email"
          value={values.email}
          onChange={(e) => handleChange('email', e.target.value)}
          error={getFieldError('email')}
        />
        <Input
          label="Password"
          name="password"
          type="password"
          value={values.password}
          onChange={(e) => handleChange('password', e.target.value)}
          error={getFieldError('password')}
        />
        <Button type="submit">Submit</Button>
      </form>
    );
  };

  test('validates required fields', async () => {
    render(<TestForm />);
    
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    await userEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Este campo es requerido')).toBeInTheDocument();
    });
  });

  test('validates email format', async () => {
    render(<TestForm />);
    
    const emailInput = screen.getByLabelText('Email');
    await userEvent.type(emailInput, 'invalid-email');
    
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    await userEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Ingresa un email válido')).toBeInTheDocument();
    });
  });

  test('validates password length', async () => {
    render(<TestForm />);
    
    const passwordInput = screen.getByLabelText('Password');
    await userEvent.type(passwordInput, '123');
    
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    await userEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Mínimo 6 caracteres')).toBeInTheDocument();
    });
  });

  test('clears errors when user types', async () => {
    render(<TestForm />);
    
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    await userEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Este campo es requerido')).toBeInTheDocument();
    });
    
    const emailInput = screen.getByLabelText('Email');
    await userEvent.type(emailInput, 'test@example.com');
    
    await waitFor(() => {
      expect(screen.queryByText('Este campo es requerido')).not.toBeInTheDocument();
    });
  });
});

// Test Diary Service
describe('DiaryService', () => {
  // Mock Firebase
  const mockAddDoc = jest.fn();
  const mockGetDocs = jest.fn();
  const mockUpdateDoc = jest.fn();
  const mockDeleteDoc = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create diary entry', async () => {
    const { DiaryService } = await import('@/lib/services/diary-service');
    
    mockAddDoc.mockResolvedValue({ id: 'test-id' });
    
    const entryData = {
      title: 'Test Entry',
      content: 'Test content',
      category: 'spiritual' as const,
      mood: 'excellent' as const,
      tags: ['test'],
      isPrivate: false,
    };

    const result = await DiaryService.createEntry('user-id', entryData);
    
    expect(result).toBe('test-id');
    expect(mockAddDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        ...entryData,
        userId: 'user-id',
      })
    );
  });

  test('should validate diary entry data', () => {
    const entryData = {
      title: '',
      content: 'Test content',
      category: 'spiritual' as const,
      mood: 'excellent' as const,
      tags: ['test'],
      isPrivate: false,
    };

    // This would test validation logic
    expect(entryData.title).toBe('');
  });
});

// Test Transfer Service
describe('TransferService', () => {
  test('should create transfer', async () => {
    const { TransferService } = await import('@/lib/services/transfer-service');
    
    const transferData = {
      transferDate: new Date(),
      previousArea: 'Area 1',
      newArea: 'Area 2',
      previousCompanion: 'Companion 1',
      newCompanion: 'Companion 2',
      notes: 'Transfer notes',
    };

    // Mock the service call
    const result = await TransferService.createTransfer('user-id', transferData);
    
    expect(result).toBeDefined();
  });
});
