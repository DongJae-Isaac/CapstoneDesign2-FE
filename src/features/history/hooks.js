import { useState, useCallback } from 'react';
import {
  getMyScanHistory,
  getScanHistoryDetail,
  deleteScanHistory,
} from './api';

/**
 * 스캔 기록 목록 조회 커스텀 훅
 * @returns {{
 *   isLoading: boolean,
 *   error: string | null,
 *   data: import('./model').ScanHistoryItem[] | null,
 *   fetchHistory: (userId: number, skip?: number, limit?: number) => Promise<void>,
 *   reset: () => void
 * }}
 */
export function useScanHistory() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const fetchHistory = useCallback(async (userId, skip = 0, limit = 20) => {
    setIsLoading(true);
    setError(null);

    try {
      const historyData = await getMyScanHistory(userId, skip, limit);
      setData(historyData);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    isLoading,
    error,
    data,
    fetchHistory,
    reset,
  };
}

/**
 * 스캔 기록 상세 조회 커스텀 훅
 * @returns {{
 *   isLoading: boolean,
 *   error: string | null,
 *   data: import('./model').ScanHistoryDetail | null,
 *   fetchDetail: (scanId: number, userId: number) => Promise<void>,
 *   reset: () => void
 * }}
 */
export function useScanHistoryDetail() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const fetchDetail = useCallback(async (scanId, userId) => {
    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      const detailData = await getScanHistoryDetail(scanId, userId);
      setData(detailData);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    isLoading,
    error,
    data,
    fetchDetail,
    reset,
  };
}

/**
 * 스캔 기록 삭제 커스텀 훅
 * @returns {{
 *   isLoading: boolean,
 *   error: string | null,
 *   success: boolean,
 *   deleteRecord: (scanId: number, userId: number) => Promise<void>,
 *   reset: () => void
 * }}
 */
export function useDeleteScanHistory() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const deleteRecord = useCallback(async (scanId, userId) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await deleteScanHistory(scanId, userId);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setSuccess(false);
  }, []);

  return {
    isLoading,
    error,
    success,
    deleteRecord,
    reset,
  };
}
