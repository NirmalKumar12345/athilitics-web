import { LocationControllerService } from '@/api/services/LocationControllerService';
import { useEffect, useState } from 'react';

interface State {
  id: number;
  name: string;
}

interface City {
  id: number;
  name: string;
}

interface Pincode {
  id: number;
  code: string;
}

interface UseLocationOptions {
  initialStateId?: number | null;
  initialCityId?: number | null;
  autoFetchStates?: boolean;
}

/**
 * Custom hook to manage state and city selection
 * Handles the relationship between states and cities, loading states, and API calls
 */
export const useLocation = (options: UseLocationOptions = {}) => {
  const { initialStateId = null, initialCityId = null, autoFetchStates = true } = options;

  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [pincodes, setPincodes] = useState<Pincode[]>([]);
  const [selectedStateId, setSelectedStateId] = useState<number | null>(initialStateId);
  const [selectedCityId, setSelectedCityId] = useState<number | null>(initialCityId);
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [isLoadingPincodes, setIsLoadingPincodes] = useState(false);
  const [statesError, setStatesError] = useState<string | null>(null);
  const [citiesError, setCitiesError] = useState<string | null>(null);
  const [pincodesError, setPincodesError] = useState<string | null>(null);

  useEffect(() => {
    if (autoFetchStates) {
      fetchStates();
    }
  }, [autoFetchStates]);

  useEffect(() => {
    if (selectedStateId) {
      fetchCities(selectedStateId);
    } else {
      setCities([]);
      setCitiesError(null);
    }
  }, [selectedStateId]);

  useEffect(() => {
    if (selectedCityId) {
      getPincodes(selectedCityId);
    } else {
      setPincodes([]);
      setPincodesError(null);
    }
  }, [selectedCityId]);

  useEffect(() => {
    if (initialStateId !== selectedStateId) {
      setSelectedStateId(initialStateId);
    }
  }, [initialStateId]);

  useEffect(() => {
    if (initialCityId !== selectedCityId) {
      setSelectedCityId(initialCityId);
    }
  }, [initialCityId]);

  const fetchStates = async () => {
    setIsLoadingStates(true);
    setStatesError(null);
    try {
      const data = await LocationControllerService.getStates();
      setStates(data || []);
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to fetch states';
      setStatesError(errorMessage);
      setStates([]);
      console.error('Error fetching states:', error);
    } finally {
      setIsLoadingStates(false);
    }
  };

  const fetchCities = async (stateId: number) => {
    setIsLoadingCities(true);
    setCitiesError(null);
    try {
      const data = await LocationControllerService.getCitiesByStateId(stateId);
      setCities(data || []);
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to fetch cities';
      setCitiesError(errorMessage);
      setCities([]);
      console.error('Error fetching cities:', error);
    } finally {
      setIsLoadingCities(false);
    }
  };

  const getPincodes = async (cityId: number) => {
    setIsLoadingPincodes(true);
    setPincodesError(null);
    try {
      const data = await LocationControllerService.getPincodesByCityId(cityId);
      setPincodes(data || []);
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to fetch pincodes';
      setPincodesError(errorMessage);
      setPincodes([]);
      console.error('Error fetching pincodes:', error);
    } finally {
      setIsLoadingPincodes(false);
    }
  };

  const handleStateChange = (stateId: number | null) => {
    setSelectedStateId(stateId);
    // Resetting selectedCityId to null because a state change invalidates the previously selected city.
    setSelectedCityId(null);
  };

  const handleCityChange = (cityId: number | null) => {
    setSelectedCityId(cityId);
  };

  const reset = () => {
    setSelectedStateId(null);
    setSelectedCityId(null);
    setCities([]);
    setCitiesError(null);
  };

  const refreshStates = () => {
    fetchStates();
  };

  const refreshCities = () => {
    if (selectedStateId) {
      fetchCities(selectedStateId);
    }
  };

  const refreshPincodes = () => {
    if (selectedCityId) {
      getPincodes(selectedCityId);
    }
  };

  return {
    // Data
    states,
    cities,
    pincodes,
    selectedStateId,
    selectedCityId,

    // Loading states
    isLoadingStates,
    isLoadingCities,
    isLoadingPincodes,
    isLoading: isLoadingStates || isLoadingCities || isLoadingPincodes,

    // Errors
    statesError,
    citiesError,
    pincodesError,
    hasError: !!statesError || !!citiesError || !!pincodesError,

    // Actions
    handleStateChange,
    handleCityChange,
    reset,
    refreshStates,
    refreshCities,
    refreshPincodes,

    // Computed values
    hasStates: states.length > 0,
    hasCities: cities.length > 0,
    hasPincodes: pincodes.length > 0,
    canSelectCity: !!selectedStateId && cities.length > 0,
  };
};
