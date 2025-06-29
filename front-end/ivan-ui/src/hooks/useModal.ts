import { useState, useCallback } from "react";

export interface UseModalResult {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export const useModal = (initialState: boolean = false): UseModalResult => {
  const [isOpen, setIsOpen] = useState(initialState);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
};

export interface UseModalWithDataResult<T> extends UseModalResult {
  data: T | null;
  openWith: (data: T) => void;
  closeAndClear: () => void;
}

export const useModalWithData = <T>(
  initialState: boolean = false
): UseModalWithDataResult<T> => {
  const [isOpen, setIsOpen] = useState(initialState);
  const [data, setData] = useState<T | null>(null);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const openWith = useCallback((modalData: T) => {
    setData(modalData);
    setIsOpen(true);
  }, []);

  const closeAndClear = useCallback(() => {
    setIsOpen(false);
    setData(null);
  }, []);

  return {
    isOpen,
    data,
    open,
    close,
    toggle,
    openWith,
    closeAndClear,
  };
};
