'use client';

import React, { useState } from 'react';
import useLocale from 'utils/useLocale';
import useGoogleAdsTracking from 'utils/useGoogleAdsTracking';
import styles from './Form.module.scss';
import Dropdown from './Dropdown';

const Form = () => {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [mobile, setMobile] = useState('');
  const [company, setCompany] = useState('');
  const [inquiry, setInquiry] = useState('');
  const [hear, setHear] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [preferredContact, setPreferredContact] = useState('');
  const [message, setMessage] = useState('');

  const { lang } = useLocale();
  const { getTrackingData } = useGoogleAdsTracking();

  const [isCompanyDropdownActive, setIsCompanyDropdownActive] = useState(false);
  const [isInquiryDropdownActive, setIsInquiryDropdownActive] = useState(false);
  const [
    isPreferredContactDropdownActive,
    setIsPreferredContactDropdownActive,
  ] = useState(false);
  const [isHearDropdownActive, setIsHearDropdownActive] = useState(false);
  const [isCountryDropdownActive, setIsCountryDropdownActive] = useState(false);
  const [isStateDropdownActive, setIsStateDropdownActive] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const countryOptions = [
    'United States',
    'Afghanistan',
    'Albania',
    'Algeria',
    'Andorra',
    'Angola',
    'Antigua and Barbuda',
    'Argentina',
    'Armenia',
    'Australia',
    'Austria',
    'Azerbaijan',
    'Bahamas',
    'Bahrain',
    'Bangladesh',
    'Barbados',
    'Belarus',
    'Belgium',
    'Belize',
    'Benin',
    'Bhutan',
    'Bolivia',
    'Bosnia and Herzegovina',
    'Botswana',
    'Brazil',
    'Brunei',
    'Bulgaria',
    'Burkina Faso',
    'Burundi',
    'Cabo Verde',
    'Cambodia',
    'Cameroon',
    'Canada',
    'Central African Republic',
    'Chad',
    'Chile',
    'China',
    'Colombia',
    'Comoros',
    'Congo, Democratic Republic of',
    'Congo, Republic of',
    'Costa Rica',
    "Côte d'Ivoire",
    'Croatia',
    'Cuba',
    'Cyprus',
    'Czech Republic',
    'Denmark',
    'Djibouti',
    'Dominica',
    'Dominican Republic',
    'Ecuador',
    'Egypt',
    'El Salvador',
    'Equatorial Guinea',
    'Eritrea',
    'Estonia',
    'Eswatini',
    'Ethiopia',
    'Fiji',
    'Finland',
    'France',
    'Gabon',
    'Gambia',
    'Georgia',
    'Germany',
    'Ghana',
    'Greece',
    'Grenada',
    'Guatemala',
    'Guinea',
    'Guinea-Bissau',
    'Guyana',
    'Haiti',
    'Honduras',
    'Hungary',
    'Iceland',
    'India',
    'Indonesia',
    'Iran',
    'Iraq',
    'Ireland',
    'Israel',
    'Italy',
    'Jamaica',
    'Japan',
    'Jordan',
    'Kazakhstan',
    'Kenya',
    'Kiribati',
    'Kosovo',
    'Kuwait',
    'Kyrgyzstan',
    'Laos',
    'Latvia',
    'Lebanon',
    'Lesotho',
    'Liberia',
    'Libya',
    'Liechtenstein',
    'Lithuania',
    'Luxembourg',
    'Madagascar',
    'Malawi',
    'Malaysia',
    'Maldives',
    'Mali',
    'Malta',
    'Marshall Islands',
    'Mauritania',
    'Mauritius',
    'Mexico',
    'Micronesia',
    'Moldova',
    'Monaco',
    'Mongolia',
    'Montenegro',
    'Morocco',
    'Mozambique',
    'Myanmar',
    'Namibia',
    'Nauru',
    'Nepal',
    'Netherlands',
    'New Zealand',
    'Nicaragua',
    'Niger',
    'Nigeria',
    'North Macedonia',
    'Norway',
    'Oman',
    'Pakistan',
    'Palau',
    'Panama',
    'Papua New Guinea',
    'Paraguay',
    'Peru',
    'Philippines',
    'Poland',
    'Portugal',
    'Qatar',
    'Romania',
    'Russia',
    'Rwanda',
    'Saint Kitts and Nevis',
    'Saint Lucia',
    'Saint Vincent and the Grenadines',
    'Samoa',
    'San Marino',
    'Sao Tome and Principe',
    'Saudi Arabia',
    'Senegal',
    'Serbia',
    'Seychelles',
    'Sierra Leone',
    'Singapore',
    'Slovakia',
    'Slovenia',
    'Solomon Islands',
    'Somalia',
    'South Africa',
    'Spain',
    'Sri Lanka',
    'Sudan',
    'Suriname',
    'Sweden',
    'Switzerland',
    'Syria',
    'Taiwan',
    'Tajikistan',
    'Tanzania',
    'Thailand',
    'Timor-Leste',
    'Togo',
    'Tonga',
    'Trinidad and Tobago',
    'Tunisia',
    'Turkey',
    'Turkmenistan',
    'Tuvalu',
    'Uganda',
    'Ukraine',
    'United Arab Emirates',
    'United Kingdom',
    'Uruguay',
    'Uzbekistan',
    'Vanuatu',
    'Venezuela',
    'Vietnam',
    'Yemen',
    'Zambia',
    'Zimbabwe',
  ];

  const stateOptions = [
    'Alabama',
    'Alaska',
    'Arizona',
    'Arkansas',
    'California',
    'Colorado',
    'Connecticut',
    'Delaware',
    'Florida',
    'Georgia',
    'Hawaii',
    'Idaho',
    'Illinois',
    'Indiana',
    'Iowa',
    'Kansas',
    'Kentucky',
    'Louisiana',
    'Maine',
    'Maryland',
    'Massachusetts',
    'Michigan',
    'Minnesota',
    'Mississippi',
    'Missouri',
    'Montana',
    'Nebraska',
    'Nevada',
    'New Hampshire',
    'New Jersey',
    'New Mexico',
    'New York',
    'North Carolina',
    'North Dakota',
    'Ohio',
    'Oklahoma',
    'Oregon',
    'Pennsylvania',
    'Rhode Island',
    'South Carolina',
    'South Dakota',
    'Tennessee',
    'Texas',
    'Utah',
    'Vermont',
    'Virginia',
    'Washington',
    'West Virginia',
    'Wisconsin',
    'Wyoming',
  ];

  const [errors, setErrors] = useState<Record<string, string>>({});

  function sanitizeInput(input) {
    return input.replace(/[&<>"'/\w\s]/g, function (char) {
      switch (char) {
        case '&':
          return '&amp;';
        case '<':
          return '&lt;';
        case '>':
          return '&gt;';
        case '"':
          return '&quot;';
        case "'":
          return '&#39;';
        case '/':
          return '&#x2F;';
        default:
          return char;
      }
    });
  }

  const validateFullname = (value) => {
    const fullNamePattern = /^[A-Z ]{3,}$/i;
    if (!value) {
      return lang.formErrorsNameRequired;
    } else if (!fullNamePattern.test(value)) {
      return lang.formErrorsNameValid;
    } else {
      return '';
    }
  };

  const validateEmail = (value) => {
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!value) {
      return lang.formErrorsEmailRequired;
    } else if (!emailPattern.test(value)) {
      return lang.formErrorsEmailValid;
    } else {
      return '';
    }
  };

  const validatePhone = (value) => {
    const phonePattern = /^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4,6})$/;
    if (value && !phonePattern.test(value)) {
      return lang.formErrorsPhoneValid;
    } else {
      return '';
    }
  };

  const validateMobile = (value) => {
    const mobilePattern = /^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4,6})$/;
    if (!value) {
      return lang.formErrorsMobileRequired;
    } else if (!mobilePattern.test(value)) {
      return lang.formErrorsMobileValid;
    } else {
      return '';
    }
  };

  const validateCountry = (value) => {
    if (!value) {
      return lang.formErrorsCountryRequired;
    } else {
      return '';
    }
  };

  const validateState = (value) => {
    if (country === 'United States' && !value) {
      return lang.formErrorsStateRequired;
    } else {
      return '';
    }
  };

  const handleFieldChange = (field, value, validator, setter) => {
    setter(value);
    const errorMessage = validator(value);
    setErrors({ ...errors, [field]: errorMessage });
  };

  const headers = {
    'Content-Type': 'application/json',
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    const newErrors = {
      fullname: validateFullname(fullname),
      email: validateEmail(email),
      phone: validatePhone(phone),
      mobile: validateMobile(mobile),
      country: validateCountry(country),
      state: validateState(state), // Validate state if the country is United States
    };

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((error) => error !== '');

    if (!hasError) {
      setIsSubmitting(true);
      setSubmitStatus('');

      const sanitizedMessage = sanitizeInput(message);

      const trackingData = getTrackingData();

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/emails`,
          {
            method: 'POST',
            headers,
            body: JSON.stringify({
              data: {
                name: fullname,
                email: email,
                mobileNumber: mobile,
                phoneNumber: phone,
                company: company,
                inquiry: inquiry,
                preferredContact: preferredContact,
                hear: hear,
                country: country,
                state: country === 'United States' ? state : '',
                message: sanitizedMessage,
                // route: window.location.origin + router.asPath,
                route: window.location.href,
                date: Date.now(),
                trackingData: trackingData,
                domain: 'pitbull',
              },
            }),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to submit form');
        }

        // Handle success
        setSubmitStatus('success');
        setTimeout(() => {
          setSubmitStatus('');
        }, 2000);

        // Reset form fields
        setFullname('');
        setEmail('');
        setPhone('');
        setMobile('');
        setCompany('');
        setInquiry('');
        setHear('');
        setCountry('');
        setState('');
        setPreferredContact('');
        setMessage('');

        // Show success message to user
      } catch (error) {
        setSubmitStatus('error');
        console.log(error);

        setTimeout(() => {
          setSubmitStatus('');
        }, 2000);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const getButtonProps = () => {
    if (isSubmitting) {
      return {
        text: 'Submitting ...',
        className: `${styles.form_submit}`,
      };
    } else if (submitStatus === 'success') {
      return {
        text: lang.formSent,
        className: `${styles.form_submit} submitted`,
      };
    } else if (submitStatus === 'error') {
      return {
        text: lang.error,
        className: `${styles.form_submit} error`,
      };
    } else {
      return {
        text: lang.formSendMessage,
        className: styles.form_submit,
      };
    }
  };

  const buttonProps = getButtonProps();

  return (
    <div className={`${styles.form} mt2`}>
      <div
        className={`${styles.form_group} ${
          errors.fullname ? styles.error : ''
        }`}
      >
        <input
          type="text"
          id="fullname"
          value={fullname}
          onChange={(e) =>
            handleFieldChange(
              'fullname',
              e.target.value,
              validateFullname,
              setFullname
            )
          }
          placeholder={`${lang.formFullName}*`}
          // required
          className={`${styles.form_input}`}
        />
        <small className={`${styles.form_input_error}`}>
          {errors.fullname}
        </small>
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
          placeholder={`${lang.formEmail}*`}
          className={`${styles.form_input}`}
          // required
        />
        <small className={`${styles.form_input_error}`}>{errors.email}</small>
      </div>

      <div
        className={`${styles.form_group} ${errors.mobile ? styles.error : ''}`}
      >
        <input
          type="tel"
          id="mobile"
          value={mobile}
          onChange={(e) =>
            handleFieldChange(
              'mobile',
              e.target.value,
              validateMobile,
              setMobile
            )
          }
          placeholder={`${lang.formMobileNumber}*`}
          className={`${styles.form_input}`}
          // required
        />
        <small className={`${styles.form_input_error}`}>{errors.mobile}</small>
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
          placeholder={`${lang.formAlternatePhoneNumber}`}
          className={`${styles.form_input}`}
        />
        <small className={`${styles.form_input_error}`}>{errors.phone}</small>
      </div>

      <div
        className={`${styles.form_group} ${errors.company ? styles.error : ''}`}
      >
        <Dropdown
          label={`${lang.formCustomerType}`}
          options={[
            lang.formCustomerTypeUSGovernment,
            lang.formCustomerTypeForeignGovernment,
            lang.formCustomerTypePrivate,
            lang.formCustomerTypeIndividual,
            lang.formCustomerTypeNGO,
            lang.formCustomerTypeOther,
          ]}
          selectedOption={company}
          setSelectedOption={setCompany}
          isActive={isCompanyDropdownActive}
          setIsActive={setIsCompanyDropdownActive}
        />
        <small className={`${styles.form_input_error}`}>{errors.company}</small>
      </div>

      <div
        className={`${styles.form_group} ${errors.inquiry ? styles.error : ''}`}
      >
        <Dropdown
          label={`${lang.formInquiry}`}
          options={[
            lang.formInquiry1,
            lang.formInquiry2,
            lang.formInquiry3,
            lang.formInquiry4,
            lang.formInquiryOther,
          ]}
          selectedOption={inquiry}
          setSelectedOption={setInquiry}
          isActive={isInquiryDropdownActive}
          setIsActive={setIsInquiryDropdownActive}
        />
        <small className={`${styles.form_input_error}`}>{errors.inquiry}</small>
      </div>

      <div
        className={`${styles.form_group} ${
          errors.preferredContact ? styles.error : ''
        }`}
      >
        <Dropdown
          label={`${lang.formContactVia}`}
          options={[
            lang.formContactViaMobile,
            lang.formContactViaLandline,
            lang.formContactViaEmail,
            lang.formContactViaText,
            lang.formContactViaWhatsapp,
          ]}
          selectedOption={preferredContact}
          setSelectedOption={setPreferredContact}
          isActive={isPreferredContactDropdownActive}
          setIsActive={setIsPreferredContactDropdownActive}
        />
        <small className={`${styles.form_input_error}`}>
          {errors.preferredContact}
        </small>
      </div>

      <div
        className={`${styles.form_group} ${errors.hear ? styles.error : ''}`}
      >
        <Dropdown
          label={`${lang.formHear}`}
          options={[
            lang.formHearInstagram,
            lang.formHearFacebook,
            lang.formHearTikTok,
            lang.formHearYouTube,
            lang.formHearSearch,
            lang.formHearRepeat,
            lang.formHearEmail,
            lang.formHearThird,
            lang.formHearReferral,
            lang.formHearOther,
          ]}
          selectedOption={hear}
          setSelectedOption={setHear}
          isActive={isHearDropdownActive}
          setIsActive={setIsHearDropdownActive}
        />
        <small className={`${styles.form_input_error}`}>{errors.hear}</small>
      </div>

      <div
        className={`${styles.form_group} ${errors.country ? styles.error : ''}`}
      >
        <Dropdown
          label={`${lang.formCountry}*`}
          options={countryOptions}
          selectedOption={country}
          setSelectedOption={(value) => {
            setCountry(value);
            setState(''); // Reset state if country changes
          }}
          isActive={isCountryDropdownActive}
          setIsActive={setIsCountryDropdownActive}
        />
        <small className={`${styles.form_input_error}`}>{errors.country}</small>
      </div>

      <div
        className={`${styles.form_group} ${errors.state ? styles.error : ''} ${
          country !== 'United States' ? styles.disabled : ''
        }`}
      >
        <Dropdown
          label={`${lang.formState}*`}
          options={stateOptions}
          selectedOption={state}
          setSelectedOption={setState}
          isActive={country === 'United States' ? isStateDropdownActive : false}
          setIsActive={setIsStateDropdownActive}
        />
        <small className={styles.form_input_error}>{errors.state}</small>
      </div>

      <div
        className={`${styles.form_group} ${styles.form_group_full} ${
          errors.message ? styles.error : ''
        }`}
      >
        <textarea
          placeholder={`${lang.formMessage}`}
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={7}
          className={`${styles.form_input} ${styles.form_textarea}`}
        />
        <small className={`${styles.form_input_error}`}>{errors.message}</small>
      </div>

      <input
        onClick={handleSubmit}
        type="submit"
        value={buttonProps.text}
        className={`${styles.form_submit}`}
        disabled={isSubmitting}
      />
    </div>
  );
};

export default Form;
