import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AddPatient from '../screens/AddPatient.js'; // Adjust the path as needed
// import {NavigationContainer} from '@react-navigation/native';

// Mock the navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn().mockReturnValue({ goBack: jest.fn() }),
}));

describe('AddPatient', () => {
  const mockPatient = {
    name: 'Jim Carry',
    dob: '1985-06-15',
    healthStatus: 'Stable',
    lastVisit: '2023-10-01',
    visitDateTime: '2023-10-15T10:30:00',
    bloodPressure: '120/80 mmHg',
    respiratoryRate: "18",
    oxygenLevel: '98%',
    heartbeatRate: '72 bpm',
  };

  it('renders correctly', () => {
    // const { getByPlaceholderText, getByText } = render(
    //   <NavigationContainer>
    //     <AddPatient />
    //   </NavigationContainer>
    // );

    // Check if the form fields are rendered
    expect(getByPlaceholderText('Enter patient name')).toBeTruthy();
    expect(getByPlaceholderText('Enter patient date of birth')).toBeTruthy();
    expect(getByText('Add Patient')).toBeTruthy();
  });

  it('fills in patient fields and submits the form', async () => {
    // const { getByPlaceholderText, getByText } = render(
    //   <NavigationContainer>
    //     <AddPatient />
    //   </NavigationContainer>
    // );

    // Fill the form fields
    fireEvent.changeText(getByPlaceholderText('Enter patient name'), mockPatient.name);
    fireEvent.changeText(getByPlaceholderText('Enter patient date of birth'), mockPatient.dob);

    // Submit the form
    fireEvent.press(getByText('Add Patient'));

    // Check that the navigation.goBack method was called after successful submission
    await waitFor(() => {
      expect(navigation.goBack).toHaveBeenCalled();
    });
  });

  it('handles API error gracefully', async () => {
    // Mock the fetch method to simulate an error
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
      })
    );

    // const { getByText } = render(
    //   <NavigationContainer>
    //     <AddPatient />
    //   </NavigationContainer>
    // );

    fireEvent.press(getByText('Add Patient'));

    await waitFor(() => {
      expect(getByText('Error')).toBeTruthy();
    });
  });

  it('displays success message on successful submission', async () => {
    // Mock successful fetch request
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockPatient),
      })
    );

    // const { getByText } = render(
    //   <NavigationContainer>
    //     <AddPatient />
    //   </NavigationContainer>
    // );

    fireEvent.press(getByText('Add Patient'));

    await waitFor(() => {
      expect(getByText('Success')).toBeTruthy();
    });
  });
});
