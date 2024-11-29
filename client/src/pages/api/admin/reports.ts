import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { generateSubscriptionReport } from '@/lib/analytics';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.isAdmin) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const { startDate, endDate, format = 'csv' } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({
                error: 'Start date and end date are required',
            });
        }

        const report = await generateSubscriptionReport(
            new Date(startDate as string),
            new Date(endDate as string),
            format as 'csv' | 'json'
        );

        if (format === 'csv') {
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader(
                'Content-Disposition',
                'attachment; filename=subscription-report.csv'
            );
        }

        res.status(200).send(report);
    } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({ error: 'Failed to generate report' });
    }
}
