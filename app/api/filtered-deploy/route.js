let lastDeployTime = 0;
const DEPLOY_COOLDOWN = 10000;

export async function POST(request) {
  if (process.env.NODE_ENV !== 'production') {
    return Response.json({
      message: 'Skipped - not in production environment',
      environment: process.env.NODE_ENV || 'development',
    });
  }

  const secret = request.headers.get('x-strapi-secret');
  if (secret !== process.env.STRAPI_WEBHOOK_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = Date.now();
  const body = await request.json();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { model, event, entry } = body;

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
    return Response.json({
      message: 'Excluded collection',
      model,
    });
  }

  const timeSinceLastDeploy = now - lastDeployTime;
  if (timeSinceLastDeploy < DEPLOY_COOLDOWN) {
    return Response.json({
      message: 'Debounced - deploy too recent',
      model,
      timeSinceLastDeploy,
    });
  }

  lastDeployTime = now;

  const deployUrl = process.env.VERCEL_DEPLOY_HOOK_URL;

  if (!deployUrl) {
    return Response.json(
      {
        error: 'VERCEL_DEPLOY_HOOK_URL not configured',
      },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(deployUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...body,
        triggeredBy: `filtered-deploy for ${model}`,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Deploy hook responded with ${response.status}`);
    }

    return Response.json({
      message: 'Deploy triggered',
      model,
      deployStatus: response.status,
    });
  } catch (error) {
    return Response.json(
      {
        error: 'Deploy failed',
        message: error.message,
        model,
      },
      { status: 500 }
    );
  }
}

// Optional: Handle GET requests for testing
export async function GET() {
  return Response.json({
    message: 'Filtered deploy webhook endpoint',
    method: 'POST required',
  });
}
