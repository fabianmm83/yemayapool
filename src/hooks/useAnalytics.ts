import { useEffect, useCallback } from 'react';
import { 
  logEvent, 
  type Analytics,
  type AnalyticsCallOptions,
  type EventParams,
  setCurrentScreen,
  setUserId,
  setUserProperties
} from 'firebase/analytics';
import { analytics } from '../services/firebase/config';

// Tipos para eventos personalizados (extender los eventos de Firebase)
type CustomEventName = 
  | 'table_occupied'
  | 'table_released'
  | 'payment_processed'
  | 'user_login'
  | 'user_logout'
  | 'session_start'
  | 'session_end'
  | 'error_occurred'
  | 'customer_created'
  | 'reservation_created'
  | 'worker_checkin'
  | 'worker_checkout';

// Interfaz para parámetros de eventos
interface CustomEventParams {
  [key: string]: string | number | boolean | null | undefined;
}

/**
 * Hook personalizado para Firebase Analytics con tipos seguros
 */
export const useAnalytics = () => {
  // Verificar si analytics está disponible
  const isAnalyticsAvailable = useCallback((): boolean => {
    return analytics !== null && typeof window !== 'undefined';
  }, []);

  /**
   * Registrar vista de pantalla (MÉTODO CORRECTO)
   */
  const logScreenView = useCallback((screenName: string, screenClass?: string): void => {
    if (!isAnalyticsAvailable() || !analytics) return;

    try {
      // Método 1: Usar setCurrentScreen (recomendado para screen views)
      setCurrentScreen(analytics, screenName);
      
      // Método 2: También puedes registrar un evento custom si necesitas más datos
      logEvent(analytics, 'screen_view_custom', {
        screen_name: screenName,
        screen_class: screenClass || screenName,
        app_name: import.meta.env.VITE_APP_NAME || 'Yemaya Pool',
        timestamp: new Date().toISOString()
      } as EventParams);
    } catch (error) {
      console.warn('Error logging screen view:', error);
    }
  }, [isAnalyticsAvailable]);

  /**
   * Registrar evento personalizado con tipos seguros
   */
  const logCustomEvent = useCallback((
    eventName: CustomEventName,
    eventParams?: CustomEventParams,
    options?: AnalyticsCallOptions
  ): void => {
    if (!isAnalyticsAvailable() || !analytics) return;

    try {
      // Convertir nuestro nombre de evento a string
      const eventNameString = eventName as string;
      
      // Log event con parámetros
      logEvent(analytics, eventNameString, eventParams as EventParams, options);
    } catch (error) {
      console.warn(`Error logging event ${eventName}:`, error);
    }
  }, [isAnalyticsAvailable]);

  /**
   * Registrar inicio de sesión de usuario
   */
  const logLogin = useCallback((userId: string, role?: string): void => {
    if (!isAnalyticsAvailable() || !analytics) return;

    try {
      // Establecer ID de usuario
      setUserId(analytics, userId);
      
      // Establecer propiedades del usuario
      if (role) {
        setUserProperties(analytics, {
          user_role: role,
          last_login: new Date().toISOString()
        });
      }
      
      // Registrar evento de login
      logCustomEvent('user_login', {
        user_id: userId,
        user_role: role,
        login_timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.warn('Error logging login:', error);
    }
  }, [isAnalyticsAvailable, logCustomEvent]);

  /**
   * Registrar cierre de sesión
   */
  const logLogout = useCallback((userId: string): void => {
    if (!isAnalyticsAvailable() || !analytics) return;

    try {
      // Limpiar ID de usuario
      setUserId(analytics, null);
      
      logCustomEvent('user_logout', {
        user_id: userId,
        logout_timestamp: new Date().toISOString(),
        session_duration: 0 // Podrías calcular esto si llevas registro
      });
    } catch (error) {
      console.warn('Error logging logout:', error);
    }
  }, [isAnalyticsAvailable, logCustomEvent]);

  /**
   * Registrar evento de mesa
   */
  const logTableEvent = useCallback((
    eventType: 'table_occupied' | 'table_released',
    tableId: string,
    tableNumber: number,
    duration?: number,
    hourlyRate?: number
  ): void => {
    logCustomEvent(eventType, {
      table_id: tableId,
      table_number: tableNumber,
      session_duration: duration,
      hourly_rate: hourlyRate,
      event_timestamp: new Date().toISOString()
    });
  }, [logCustomEvent]);

  /**
   * Registrar pago procesado
   */
  const logPayment = useCallback((
    amount: number,
    method: string,
    sessionId?: string,
    tableId?: string
  ): void => {
    logCustomEvent('payment_processed', {
      payment_amount: amount,
      payment_method: method,
      session_id: sessionId,
      table_id: tableId,
      currency: 'MXN',
      payment_timestamp: new Date().toISOString()
    });
  }, [logCustomEvent]);

  /**
   * Registrar error
   */
  const logError = useCallback((
    errorMessage: string, 
    errorCode?: string, 
    component?: string,
    severity: 'low' | 'medium' | 'high' = 'medium'
  ): void => {
    logCustomEvent('error_occurred', {
      error_message: errorMessage,
      error_code: errorCode,
      component: component,
      severity: severity,
      error_timestamp: new Date().toISOString()
    });
  }, [logCustomEvent]);

  /**
   * Registrar evento de sesión
   */
  const logSessionEvent = useCallback((
    eventType: 'session_start' | 'session_end',
    sessionId: string,
    tableId: string,
    duration?: number,
    amount?: number
  ): void => {
    logCustomEvent(eventType, {
      session_id: sessionId,
      table_id: tableId,
      session_duration: duration,
      session_amount: amount,
      event_timestamp: new Date().toISOString()
    });
  }, [logCustomEvent]);

  /**
   * Registrar creación de cliente
   */
  const logCustomerCreated = useCallback((
    customerId: string,
    customerName: string,
    source?: string
  ): void => {
    logCustomEvent('customer_created', {
      customer_id: customerId,
      customer_name: customerName,
      source: source || 'manual',
      creation_timestamp: new Date().toISOString()
    });
  }, [logCustomEvent]);

  /**
   * Registrar check-in/out de trabajador
   */
  const logWorkerEvent = useCallback((
    eventType: 'worker_checkin' | 'worker_checkout',
    workerId: string,
    workerName: string
  ): void => {
    logCustomEvent(eventType, {
      worker_id: workerId,
      worker_name: workerName,
      event_timestamp: new Date().toISOString(),
      shift_date: new Date().toLocaleDateString()
    });
  }, [logCustomEvent]);

  // Hook para registrar vista de pantalla automáticamente
  const useAutoScreenView = (screenName: string, screenClass?: string) => {
    useEffect(() => {
      logScreenView(screenName, screenClass);
    }, [screenName, screenClass, logScreenView]);
  };

  return {
    // Funciones principales
    logScreenView,
    logCustomEvent,
    
    // Funciones específicas
    logLogin,
    logLogout,
    logTableEvent,
    logPayment,
    logError,
    logSessionEvent,
    logCustomerCreated,
    logWorkerEvent,
    
    // Hook para auto-screen view
    useAutoScreenView,
    
    // Utilidades
    isAnalyticsAvailable: isAnalyticsAvailable()
  };
};

export default useAnalytics;