let lastDeployTime = 0;
const DEPLOY_COOLDOWN = 10000;

export default async function handler(req, res) {
  //   if (process.env.NODE_ENV !== 'production') {
  //     return res.status(200).json({
  //       message: 'Skipped - not in production environment',
  //       environment: process.env.NODE_ENV || 'development',
  //     });
  //   }

  //   const secret = req.headers['x-strapi-secret'];
  //   if (secret !== process.env.STRAPI_WEBHOOK_SECRET) {
  //     return res.status(401).json({ error: 'Unauthorized' });
  //   }
  console.log('a');
  const now = Date.now();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { model, event, entry } = req.body;

  const excludedCollections = [
    'updated-entry',
    'upload-file',
    'user-sessions',
    'strapi-users',
    'fa-qs-rental',
    'fa-qs-swat',
    'locations-rental',
    'vehicles-alternative',
    'rental-policy',
    'rentals-contact-page',
    'rentals-homepage',
    'rentals-listing',
    'rentals-locations-page',
    'swat-about',
    'swat-all-download',
    'swat-ballistic-testing',
    'swat-contact-page',
    'swat-homepage',
    'swat-listing-inventory',
    'swat-listing-model',
    'swat-news-testimonial',
  ];

  console.log(model);

  if (excludedCollections.includes(model)) {
    return res.status(200).json({
      message: 'Excluded collection',
      model,
    });
  }

  const timeSinceLastDeploy = now - lastDeployTime;
  if (timeSinceLastDeploy < DEPLOY_COOLDOWN) {
    return res.status(200).json({
      message: 'Debounced - deploy too recent',
      model,
      timeSinceLastDeploy,
    });
  }

  lastDeployTime = now;

  const deployUrl = process.env.VERCEL_DEPLOY_HOOK_URL;

  if (!deployUrl) {
    return res.status(500).json({
      error: 'VERCEL_DEPLOY_HOOK_URL not configured',
    });
  }

  try {
    const response = await fetch(deployUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...req.body,
        triggeredBy: `filtered-deploy for ${model}`,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Deploy hook responded with ${response.status}`);
    }

    res.status(200).json({
      message: 'Deploy triggered',
      model,
      deployStatus: response.status,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Deploy failed',
      message: error.message,
      model,
    });
  }
}
