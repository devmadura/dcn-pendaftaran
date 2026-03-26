import { useState, useEffect } from 'react';

export function useNimValidation(nim: string) {
  const [isValidating, setIsValidating] = useState(false);
  const [nimValidity, setNimValidity] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [studentName, setStudentName] = useState("");

  useEffect(() => {
    if (!nim || nim.trim().length < 10) {
      setNimValidity('idle');
      setStudentName("");
      return;
    }

    const timer = setTimeout(async () => {
      setIsValidating(true);
      try {
        const res = await fetch(`/api/mahasiswa?nim=${nim.trim()}`);
        const json = await res.json();

        if (json.success && json.data) {
          setNimValidity('valid');
          setStudentName(json.data.nama || "");
        } else {
          setNimValidity('invalid');
          setStudentName("");
        }
      } catch (err) {
        setNimValidity('invalid');
        setStudentName("");
      } finally {
        setIsValidating(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [nim]);

  return { isValidating, nimValidity, studentName };
}
