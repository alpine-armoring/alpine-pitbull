'use client';
import styles from './VehicleDetailsPage.module.scss';

interface VehicleDetails {
  armor_level?: string;
  VIN?: string;
  vehicleID?: string;
  engine?: string;
  trans?: string;
  year?: string;
  miles?: string;
  driveTrain?: string;
  color_ext?: string;
  color_int?: string;
  trim?: string;
  wheels?: string;
  height?: string;
  length?: string;
  width?: string;
  wheelbase?: string;
  weight?: string;
}

interface VehicleDetailsListProps {
  vehicleDetails: VehicleDetails;
}

const VehicleDetailsList = ({
  vehicleDetails,
}: VehicleDetailsListProps): React.ReactElement => {
  const vehicleDetailsMain: Record<string, keyof VehicleDetails> = {
    'Armor Level': 'armor_level',
    VIN: 'VIN',
    'Vehicle ID': 'vehicleID',
    Engine: 'engine',
    Transmission: 'trans',
    Year: 'year',
    Miles: 'miles',
    Drivetrain: 'driveTrain',
    'Exterior Color': 'color_ext',
    'Interior Color': 'color_int',
    Trim: 'trim',
    Wheels: 'wheels',
    Height: 'height',
    Length: 'length',
    Width: 'width',
    Wheelbase: 'wheelbase',
    'Weight (Armored)': 'weight',
  };

  const formatDimensionValue = (key: string, value: string): string => {
    if (key === 'Weight (Armored)') {
      const poundsValue =
        parseInt(value) >= 1000
          ? parseInt(value).toLocaleString()
          : parseInt(value);
      const weightInKg = Math.round(parseFloat(value) * 0.45359237);
      const kilogramsValue =
        weightInKg >= 1000 ? weightInKg.toLocaleString() : weightInKg;
      return `${poundsValue} lbs (${kilogramsValue} kg)`;
    } else if (['Height', 'Length', 'Width', 'Wheelbase'].includes(key)) {
      return `${value} in. (${Math.round(parseFloat(value) * 2.54)} cm)`;
    } else {
      return value;
    }
  };

  const isValidValue = (value: string | undefined): boolean => {
    return value != null && value !== '' && value !== ' ';
  };

  return (
    <ul className={`${styles.inventory_details_list}`}>
      {Object.entries(vehicleDetailsMain).map(([key, value]) => {
        const fieldValue = vehicleDetails?.[value];

        if (!isValidValue(fieldValue)) {
          return null;
        }

        const dimensionValue = formatDimensionValue(key, fieldValue!);

        return (
          <li key={key} className={`${styles.inventory_details_list_item}`}>
            {`${key}:`}
            <span>{dimensionValue}</span>
          </li>
        );
      })}
    </ul>
  );
};

export default VehicleDetailsList;
