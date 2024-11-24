import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import PatientsList from "../screens/patientsList.js"; // Adjust path as necessary
import { NavigationContainer } from '@react-navigation/native';

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
    }),
  };
});

describe('PatientsList Screen', () => {
  const mockPatients = [
    {
      id: '1',
      name: 'John Doe',
      dob: '1985-01-01',
      healthStatus: 'Stable',
    },
    {
      id: '2',
      name: 'Jane Smith',
      dob: '1990-06-15',
      healthStatus: 'Critical',
    },
  ];

  const mockRoute = {
    params: {
      userName: 'TestUser',
    },
  };

  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockPatients),
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the user name and profile picture', async () => {
    const { getByText, getByAltText } = render(
      <NavigationContainer>
        <PatientsList route={mockRoute} />
      </NavigationContainer>
    );

    expect(getByText(/Welcome, TestUser!/i)).toBeTruthy();
    expect(getByAltText(/profile picture/i)).toBeTruthy();
  });

  it('displays a list of patients after loading', async () => {
    const { getByText, queryByText } = render(
      <NavigationContainer>
        <PatientsList route={mockRoute} />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(queryByText(/loading/i)).toBeNull();
    });

    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('Jane Smith')).toBeTruthy();
  });

  it('filters patients by health status', async () => {
    const { getByText, queryByText, getByTestId } = render(
      <NavigationContainer>
        <PatientsList route={mockRoute} />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(queryByText(/loading/i)).toBeNull();
    });

    fireEvent.press(getByTestId('filterButton'));
    fireEvent.press(getByText(/Critical/i));

    await waitFor(() => {
      expect(queryByText('John Doe')).toBeNull();
      expect(getByText('Jane Smith')).toBeTruthy();
    });
  });

  it('handles API errors gracefully', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
      })
    );

    const { getByText } = render(
      <NavigationContainer>
        <PatientsList route={mockRoute} />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText(/Failed to fetch patients/i)).toBeTruthy();
    });
  });
});
