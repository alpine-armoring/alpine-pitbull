'use client';

import React, { useState } from 'react';
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

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validPasswords.includes(password)) {
      setIsAuthenticated(true);
      setPasswordError('');
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
          <p className={`mb1`}>
            Fill out the form below to request access to our vehicle
            configurator.
            <br />
            We&apos;ll send you a password via email.
          </p>

          <ConfiguratorForm selectedOptions={{}} />
        </div>

        <div>
          <p className={`mb1`}>Already have a password?</p>

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
