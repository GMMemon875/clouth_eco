import { Request, Response } from 'express';
import { getStoreSettings } from '../services/settingsService';

export async function getSettingsHandler(_req: Request, res: Response) {
  try {
    const settings = await getStoreSettings();
    res.json({
      success: true,
      data: settings,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch store settings',
    });
  }
}
