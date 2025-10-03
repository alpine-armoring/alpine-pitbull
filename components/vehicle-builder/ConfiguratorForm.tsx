'use client';

import React, { useState } from 'react';
import styles from '@/components/form/Form.module.scss';

interface ConfiguratorFormProps {
  selectedOptions: Record<string, string | string[]>;
  requestPassword: boolean;
}

const ConfiguratorForm: React.FC<ConfiguratorFormProps> = ({
  selectedOptions,
  requestPassword,
}) => {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const validateName = (value: string): string => {
    const namePattern = /^[A-Z ]{3,}$/i;
    if (!value) {
      return 'Name is required';
    } else if (!namePattern.test(value)) {
      return 'Please enter a valid name';
    }
    return '';
  };

  const validateEmail = (value: string): string => {
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!value) {
      return 'Email is required';
    } else if (!emailPattern.test(value)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const validatePhone = (value: string): string => {
    const phonePattern = /^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4,6})$/;
    if (!value) {
      return 'Phone is required';
    } else if (!phonePattern.test(value)) {
      return 'Please enter a valid phone number';
    }
    return '';
  };

  const handleFieldChange = (
    field: string,
    value: string,
    validator: (value: string) => string,
    setter: (value: string) => void
  ) => {
    setter(value);
    const errorMessage = validator(value);
    setErrors({ ...errors, [field]: errorMessage });
  };

  const formatSelectedOptions = (): string => {
    const optionStrings: string[] = [];

    // Reason: Format category names by removing dashes, capitalizing each word
    const formatCategoryName = (key: string): string => {
      return key
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };

    Object.entries(selectedOptions).forEach(([key, value]) => {
      if (value) {
        const formattedCategory = `**${formatCategoryName(key)}:**`;

        if (Array.isArray(value) && value.length > 0) {
          optionStrings.push(`${formattedCategory}\n${value.join(', ')}`);
        } else if (!Array.isArray(value) && value !== '') {
          optionStrings.push(`${formattedCategory}\n${value}`);
        }
      }
    });

    return optionStrings.join('\n\n');
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    const newErrors = {
      name: validateName(name),
      email: validateEmail(email),
      phone: validatePhone(phone),
    };

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((error) => error !== '');

    if (!hasError) {
      setIsSubmitting(true);
      setSubmitStatus('');

      const configuratorOptions = formatSelectedOptions();

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/emails`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              data: {
                name: name,
                email: email,
                phoneNumber: phone,
                company: company,
                message: configuratorOptions,
                route: window.location.origin + window.location.pathname,
                date: Date.now(),
                domain: 'pitbull',
                inquiry: requestPassword ? 'requestPassword' : 'requestInquiry',
              },
            }),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to submit form');
        }

        setSubmitStatus('success');
        setTimeout(() => {
          setSubmitStatus('');
        }, 3000);

        // Reset form fields
        setName('');
        setEmail('');
        setPhone('');
        setCompany('');
      } catch (error) {
        setSubmitStatus('error');
        console.log(error);
        setTimeout(() => {
          setSubmitStatus('');
        }, 3000);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const getButtonProps = () => {
    if (isSubmitting) {
      return {
        text: 'Submitting...',
        className: styles.form_submit,
      };
    } else if (submitStatus === 'success') {
      return {
        text: 'Sent Successfully!',
        className: `${styles.form_submit} submitted`,
      };
    } else if (submitStatus === 'error') {
      return {
        text: 'Error - Try Again',
        className: `${styles.form_submit} error`,
      };
    } else {
      return {
        text: 'Send Inquiry',
        className: styles.form_submit,
      };
    }
  };

  const buttonProps = getButtonProps();

  return (
    <div className={`${styles.form} ${styles.form_plain}`}>
      <div
        className={`${styles.form_group} ${errors.name ? styles.error : ''}`}
      >
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) =>
            handleFieldChange('name', e.target.value, validateName, setName)
          }
          placeholder="Name*"
          className={styles.form_input}
        />
        <small className={styles.form_input_error}>{errors.name}</small>
      </div>

      <div
        className={`${styles.form_group} ${errors.company ? styles.error : ''}`}
      >
        <input
          type="text"
          id="company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Company"
          className={styles.form_input}
        />
        <small className={styles.form_input_error}>{errors.company}</small>
      </div>

      <div
        className={`${styles.form_group} ${errors.phone ? styles.error : ''}`}
      >
        <input
          type="tel"
          id="phone"
          value={phone}
          onChange={(e) =>
            handleFieldChange('phone', e.target.value, validatePhone, setPhone)
          }
          placeholder="Phone*"
          className={styles.form_input}
        />
        <small className={styles.form_input_error}>{errors.phone}</small>
      </div>

      <div
        className={`${styles.form_group} ${errors.email ? styles.error : ''}`}
      >
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) =>
            handleFieldChange('email', e.target.value, validateEmail, setEmail)
          }
          placeholder="Email*"
          className={styles.form_input}
        />
        <small className={styles.form_input_error}>{errors.email}</small>
      </div>

      <input
        onClick={handleSubmit}
        type="submit"
        value={buttonProps.text}
        className={buttonProps.className}
        disabled={isSubmitting}
      />
    </div>
  );
};

export default ConfiguratorForm;
