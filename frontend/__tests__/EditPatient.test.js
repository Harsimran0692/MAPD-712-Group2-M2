import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import EditPatient from './EditPatient';
import { NavigationContainer } from '@react-navigation/native';

jest.mock('react-native', () => {
  const actualReactNative = jest.requireActual('react-native');
  return {
    ...actualReactNative,
    Alert: {
      alert: jest.fn(),
    },
  };
});

// Mock navigation prop
const mockNavigation = { goBack: jest.fn() };

const mockPatient = {
  _id: '123',
  name: 'John Doe',
  dob: '1990-01-01',
  healthStatus: 'Healthy',
  lastVisit: '2024-01-01',
  visitDateTime: '2024-01-01 10:00',
  bloodPressure: '120/80',
  respiratoryRate: 16,
  oxygenLevel: 98,
  heartbeatRate: 72,
  image: 'http://example.com/image.jpg',
};

describe('EditPatient', () => {
  it('renders the EditPatient form correctly', () => {
    const { getByPlaceholderText, getByText } = render(
      <NavigationContainer>
        <EditPatient route={{ params: { patient: mockPatient } }} navigation={mockNavigation} />
      </NavigationContainer>
    );

    // Check if all input fields are rendered
    expect(getByPlaceholderText('Patient Name')).toBeTruthy();
    expect(getByPlaceholderText('Date of Birth (YYYY-MM-DD)')).toBeTruthy();
    expect(getByPlaceholderText('Health Status')).toBeTruthy();
    expect(getByPlaceholderText('Last Visit')).toBeTruthy();
    expect(getByPlaceholderText('Visit Date and Time')).toBeTruthy();
    expect(getByPlaceholderText('Blood Pressure')).toBeTruthy();
    expect(getByPlaceholderText('Respiratory Rate')).toBeTruthy();
    expect(getByPlaceholderText('Oxygen Level')).toBeTruthy();
    expect(getByPlaceholderText('Heartbeat Rate')).toBeTruthy();
    expect(getByPlaceholderText('Image URL')).toBeTruthy();
    expect(getByText('Update Details')).toBeTruthy();
  });

  it('updates form data correctly', () => {
    const { getByPlaceholderText } = render(
      <NavigationContainer>
        <EditPatient route={{ params: { patient: mockPatient } }} navigation={mockNavigation} />
      </NavigationContainer>
    );

    // Simulate user input
    fireEvent.changeText(getByPlaceholderText('Patient Name'), 'Jane Doe');
    fireEvent.changeText(getByPlaceholderText('Date of Birth (YYYY-MM-DD)'), '1992-02-02');
    
    expect(getByPlaceholderText('Patient Name').props.value).toBe('Jane Doe');
    expect(getByPlaceholderText('Date of Birth (YYYY-MM-DD)').props.value).toBe('1992-02-02');
  });

  it('submits the form correctly', async () => {
    // Mock the fetch API response
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ message: 'Success' }),
    });

    const { getByPlaceholderText, getByText } = render(
      <NavigationContainer>
        <EditPatient route={{ params: { patient: mockPatient } }} navigation={mockNavigation} />
      </NavigationContainer>
    );

    // Simulate user input
    fireEvent.changeText(getByPlaceholderText('Patient Name'), 'Jane Doe');

    // Submit the form
    fireEvent.press(getByText('Update Details'));

    // Wait for the API call and check that the fetch function was called
    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith(
      `http://localhost:3000/api/patient/${mockPatient._id}`,
      expect.objectContaining({
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...mockPatient,
          name: 'Jane Doe',
        }),
      })
    ));

    // Check if navigation.goBack() was called on success
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it('shows an error if API call fails', async () => {
    // Mock the fetch API to simulate an error
    global.fetch = jest.fn().mockRejectedValue(new Error('Failed to update patient details'));

    const { getByPlaceholderText, getByText } = render(
      <NavigationContainer>
        <EditPatient route={{ params: { patient: mockPatient } }} navigation={mockNavigation} />
      </NavigationContainer>
    );

    // Simulate user input
    fireEvent.changeText(getByPlaceholderText('Patient Name'), 'Jane Doe');

    // Submit the form
    fireEvent.press(getByText('Update Details'));

    // Wait for the error and check if alert was called
    await waitFor(() => expect(global.Alert.alert).toHaveBeenCalledWith(
      'Error',
      'Failed to update patient details'
    ));
  });
});
