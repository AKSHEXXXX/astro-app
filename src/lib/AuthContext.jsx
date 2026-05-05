import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from './supabase.js';

const AuthContext = createContext(null);

/* ── Modal state lives here so any component can trigger it ── */
const ModalContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasClaimedFreeConsult, setHasClaimedFreeConsult] = useState(false);
  const [dataVersion, setDataVersion] = useState(0);

  /* Modal state */
  const [modalOpen,      setModalOpen]      = useState(false);
  const [onSuccessCb,    setOnSuccessCb]    = useState(null);
  const [redirectAction, setRedirectAction] = useState(null);

  const fetchClaimStatus = async (userId) => {
    if (!userId) {
      setHasClaimedFreeConsult(false);
      return;
    }
    const { count, error } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error fetching claim status:', error);
      return;
    }
    setHasClaimedFreeConsult(count > 0);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      fetchClaimStatus(session?.user?.id);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      fetchClaimStatus(u?.id);
      if (u && onSuccessCb) {
        onSuccessCb();
        setOnSuccessCb(null);
      }
    });

    return () => listener.subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setHasClaimedFreeConsult(false);
  };


  /** Call this from any component to require auth before proceeding */
  const requireAuth = useCallback((onSuccess) => {
    if (user) {
      onSuccess?.();
    } else {
      setOnSuccessCb(() => onSuccess);
      setModalOpen(true);
    }
  }, [user]);

  const openModal  = useCallback(() => setModalOpen(true),  []);
  const closeModal = useCallback(() => {
    setModalOpen(false);
    setOnSuccessCb(null);
  }, []);

  const refreshClaimStatus = async () => {
    console.log('Refreshing claim status for user:', user?.id);
    await fetchClaimStatus(user?.id);
    setDataVersion(v => v + 1); // Trigger global update
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut, requireAuth, hasClaimedFreeConsult, refreshClaimStatus, dataVersion }}>
      <ModalContext.Provider value={{ modalOpen, openModal, closeModal, redirectAction, setRedirectAction }}>
        {children}
      </ModalContext.Provider>
    </AuthContext.Provider>
  );
}

export const useAuth      = () => useContext(AuthContext);
export const useAuthModal = () => useContext(ModalContext);
