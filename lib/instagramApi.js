export async function getInstagramFeed() {
  try {
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    const fields =
      'id,media_type,media_url,thumbnail_url,permalink,caption,timestamp';

    const response = await fetch(
      `https://graph.instagram.com/me/media?fields=${fields}&limit=8&access_token=${accessToken}`,
      {
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch Instagram data');
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching Instagram feed:', error);
    return [];
  }
}
