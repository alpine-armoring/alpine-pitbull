import React from 'react';
import type { Metadata } from 'next';
import { cache } from 'react';
import { getStrapiData } from '@/lib/fechData';
import InventoryList from '@/components/inventory/InventoryList';
import FadeInContent from '@/components/FadeInContent';
import InventoryPageWrapper from '@/components/inventory/InventoryPageWrapper';

const getInventoryData = cache(async () => {
  try {
    const inventoryData = await getStrapiData({
      route: 'inventories',
      custom:
        'filters[title][$contains]=Pit-Bull&filters[$and][0][$or][0][hide][$null]=true&filters[$and][0][$or][1][hide][$eq]=false&filters[$and][1][$or][0][flag][$ne]=sold&filters[$and][1][$or][1][flag][$null]=true&pagination[pageSize]=100&populate=featuredImage&fields[0]=title&fields[1]=slug&fields[2]=armor_level&fields[3]=engine&fields[4]=VIN&fields[5]=hide&fields[6]=flag&fields[7]=label&fields[8]=vehicleID',
      pageSize: 100,
      revalidate: 3600,
    });

    return {
      vehicles: inventoryData?.data || [],
    };
  } catch (error) {
    console.error('Error fetching inventory data:', error);
    return {
      vehicles: [],
    };
  }
});

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Pit-Bull® Inventory | Available Vehicles',
    description:
      'Browse our current inventory of Pit-Bull® armored vehicles available for immediate delivery.',
  };
}

const InventoryPage = async (): Promise<React.ReactElement> => {
  const { vehicles } = await getInventoryData();

  return (
    <InventoryPageWrapper>
      <div className="mt6 pb2 container">
        <FadeInContent>
          <div className="c-content">
            <h1 className="c-title">Pit-Bull® Inventory</h1>
            <p className="c-description">
              Available vehicles ready for immediate delivery
            </p>
          </div>

          <InventoryList vehicles={vehicles} />
        </FadeInContent>
      </div>
    </InventoryPageWrapper>
  );
};

export default InventoryPage;
