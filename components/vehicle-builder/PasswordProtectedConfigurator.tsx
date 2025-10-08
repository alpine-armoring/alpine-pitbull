'use client';

import React, { useState, useEffect } from 'react';
import stylesForm from '@/components/form/Form.module.scss';
import VehicleBuilder from './VehicleBuilder';
import ConfiguratorForm from './ConfiguratorForm';
import styles from './VehicleBuilder.module.scss';

interface PasswordProtectedConfiguratorProps {
  configuratorMedia: unknown;
}

const PasswordProtectedConfigurator: React.FC<
  PasswordProtectedConfiguratorProps
> = ({ configuratorMedia }) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const validPasswords = ['Alpine-PB'];

  // Check localStorage on component mount
  useEffect(() => {
    const savedAuth = localStorage.getItem('configurator_auth');
    if (savedAuth) {
      const { authenticated, expiry } = JSON.parse(savedAuth);
      const now = new Date().getTime();

      // Check if authentication is still valid (not expired)
      if (authenticated && expiry > now) {
        setIsAuthenticated(true);
      } else {
        // Remove expired authentication
        localStorage.removeItem('configurator_auth');
      }
    }
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validPasswords.includes(password)) {
      setIsAuthenticated(true);
      setPasswordError('');

      // Save authentication to localStorage with 1 month expiry
      const expiryDate = new Date();
      expiryDate.setMonth(expiryDate.getMonth() + 1);

      localStorage.setItem(
        'configurator_auth',
        JSON.stringify({
          authenticated: true,
          expiry: expiryDate.getTime(),
        })
      );
    } else {
      setPasswordError('Invalid password. Please try again.');
      setPassword('');
    }
  };

  if (isAuthenticated) {
    return <VehicleBuilder configuratorMedia={configuratorMedia} />;
  }

  return (
    <>
      <div className={`${styles.vehicleConfigurator_heading} c-content`}>
        <h2 className={`${styles.vehicleConfigurator_title} c-title`}>
          Build Your Pit-Bull®
        </h2>
      </div>

      <div className={`${styles.vehicleConfigurator_initial} container_small`}>
        <div>
          <p className={`${styles.vehicleConfigurator_initial_title} mb1`}>
            Fill out the form below to request access to our vehicle
            configurator.
            <br />
            We&apos;ll send you a password via email.
          </p>

          <ConfiguratorForm selectedOptions={{}} requestPassword />
        </div>

        <div>
          <p className={`${styles.vehicleConfigurator_initial_title} mb1`}>
            Already have a password?
          </p>

          <form
            onSubmit={handlePasswordSubmit}
            className={`${stylesForm.form} ${stylesForm.form_plain}`}
          >
            <div
              className={`${stylesForm.form_plain_passwordWrap} ${passwordError ? stylesForm.error : ''}`}
            >
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError('');
                }}
                placeholder="Enter password"
                className={stylesForm.form_input}
                required
              />
              {/* <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#666',
                }}
              >
                {showPassword ? '👁️' : '🙈'}
              </button> */}

              {passwordError && (
                <small
                  className={stylesForm.form_input_error}
                  style={{ visibility: 'visible' }}
                >
                  {passwordError}
                </small>
              )}
            </div>

            <input
              type="submit"
              value="Access Configurator"
              className={`${stylesForm.form_submit} m1`}
            />
          </form>
        </div>
      </div>
    </>
  );
};

export default PasswordProtectedConfigurator;
