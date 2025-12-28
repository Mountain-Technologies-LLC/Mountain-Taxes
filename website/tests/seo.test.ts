/**
 * SEO and Accessibility Tests
 * Tests for SEO meta tags, structured data, and accessibility features
 */

import fs from 'fs';
import path from 'path';

describe('SEO and Accessibility Tests', () => {
    let htmlContent: string;

    beforeAll(() => {
        // Read the HTML file
        const htmlPath = path.join(__dirname, '../index.html');
        htmlContent = fs.readFileSync(htmlPath, 'utf-8');
    });

    describe('Basic SEO Meta Tags', () => {
        test('should have proper title tag', () => {
            expect(htmlContent).toContain('<title>Mountain Taxes - Compare State Income Tax Rates | Interactive Tax Calculator</title>');
            expect(htmlContent).toContain('Mountain Taxes');
            expect(htmlContent).toContain('State Income Tax');
            expect(htmlContent).toContain('Calculator');
        });

        test('should have meta description', () => {
            expect(htmlContent).toContain('name="description"');
            expect(htmlContent).toContain('Compare state earned income tax obligations across all 50 US states');
            expect(htmlContent).toContain('interactive tax calculator');
        });

        test('should have meta keywords', () => {
            expect(htmlContent).toContain('name="keywords"');
            expect(htmlContent).toContain('state income tax');
            expect(htmlContent).toContain('tax calculator');
        });

        test('should have canonical URL', () => {
            expect(htmlContent).toContain('rel="canonical"');
            expect(htmlContent).toContain('href="https://taxes.mountaintechnologiesllc.com/"');
        });

        test('should have proper language attribute', () => {
            expect(htmlContent).toContain('<html lang="en">');
        });

        test('should have viewport meta tag', () => {
            expect(htmlContent).toContain('name="viewport"');
            expect(htmlContent).toContain('width=device-width');
        });
    });

    describe('Open Graph Meta Tags', () => {
        test('should have Open Graph type', () => {
            expect(htmlContent).toContain('property="og:type"');
            expect(htmlContent).toContain('content="website"');
        });

        test('should have Open Graph title', () => {
            expect(htmlContent).toContain('property="og:title"');
            expect(htmlContent).toContain('Mountain Taxes');
        });

        test('should have Open Graph description', () => {
            expect(htmlContent).toContain('property="og:description"');
            expect(htmlContent).toContain('Compare state earned income tax');
        });

        test('should have Open Graph URL', () => {
            expect(htmlContent).toContain('property="og:url"');
            expect(htmlContent).toContain('https://taxes.mountaintechnologiesllc.com/');
        });

        test('should have Open Graph image', () => {
            expect(htmlContent).toContain('property="og:image"');
            expect(htmlContent).toContain('mountain-taxes-preview.png');
        });
    });

    describe('Twitter Card Meta Tags', () => {
        test('should have Twitter card type', () => {
            expect(htmlContent).toContain('property="twitter:card"');
            expect(htmlContent).toContain('summary_large_image');
        });

        test('should have Twitter title', () => {
            expect(htmlContent).toContain('property="twitter:title"');
            expect(htmlContent).toContain('Mountain Taxes');
        });

        test('should have Twitter description', () => {
            expect(htmlContent).toContain('property="twitter:description"');
            expect(htmlContent).toContain('Interactive tax calculator');
        });
    });

    describe('Structured Data', () => {
        test('should have Organization structured data', () => {
            expect(htmlContent).toContain('application/ld+json');
            expect(htmlContent).toContain('"@type": "Organization"');
            expect(htmlContent).toContain('Mountain Technologies LLC');
        });

        test('should have WebApplication structured data', () => {
            expect(htmlContent).toContain('"@type": "WebApplication"');
            expect(htmlContent).toContain('"name": "Mountain Taxes"');
            expect(htmlContent).toContain('FinanceApplication');
        });

        test('should have BreadcrumbList structured data', () => {
            expect(htmlContent).toContain('"@type": "BreadcrumbList"');
        });
    });

    describe('Accessibility Features', () => {
        test('should have skip to main content link', () => {
            expect(htmlContent).toContain('href="#main-content"');
            expect(htmlContent).toContain('Skip to main content');
        });

        test('should have proper semantic HTML structure', () => {
            expect(htmlContent).toContain('<header>');
            expect(htmlContent).toContain('<main');
            expect(htmlContent).toContain('<footer');
        });

        test('should have proper ARIA labels', () => {
            expect(htmlContent).toContain('aria-label="Main navigation"');
            expect(htmlContent).toContain('aria-label');
        });

        test('should have proper microdata structure', () => {
            expect(htmlContent).toContain('itemscope');
            expect(htmlContent).toContain('itemtype="https://schema.org/WebApplication"');
        });
    });

    describe('PWA Features', () => {
        test('should have manifest link', () => {
            expect(htmlContent).toContain('rel="manifest"');
            expect(htmlContent).toContain('href="/manifest.json"');
        });

        test('should have theme color', () => {
            expect(htmlContent).toContain('name="theme-color"');
            expect(htmlContent).toContain('content="#a2e436"');
        });

        test('should have apple touch icon', () => {
            expect(htmlContent).toContain('rel="apple-touch-icon"');
            expect(htmlContent).toContain('apple-touch-icon.png');
        });
    });

    describe('Performance and Security', () => {
        test('should have proper external link attributes', () => {
            expect(htmlContent).toContain('rel="noopener noreferrer"');
        });

        test('should have proper favicon links', () => {
            expect(htmlContent).toContain('rel="icon"');
            expect(htmlContent).toContain('favicon-32x32.png');
            expect(htmlContent).toContain('favicon-16x16.png');
        });
    });
});

describe('SEO Files Tests', () => {
    describe('Robots.txt', () => {
        test('should have robots.txt file', () => {
            const robotsPath = path.join(__dirname, '../public/robots.txt');
            expect(fs.existsSync(robotsPath)).toBe(true);
            
            const content = fs.readFileSync(robotsPath, 'utf-8');
            expect(content).toContain('User-agent: *');
            expect(content).toContain('Allow: /');
            expect(content).toContain('Sitemap: https://taxes.mountaintechnologiesllc.com/sitemap.xml');
        });
    });

    describe('Sitemap.xml', () => {
        test('should have sitemap.xml file', () => {
            const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
            expect(fs.existsSync(sitemapPath)).toBe(true);
            
            const content = fs.readFileSync(sitemapPath, 'utf-8');
            expect(content).toContain('<?xml version="1.0" encoding="UTF-8"?>');
            expect(content).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
            expect(content).toContain('https://taxes.mountaintechnologiesllc.com/');
        });

        test('should include all state pages in sitemap', () => {
            const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
            const content = fs.readFileSync(sitemapPath, 'utf-8');
            
            // Check for some key states
            expect(content).toContain('California');
            expect(content).toContain('Texas');
            expect(content).toContain('Florida');
            expect(content).toContain('New York');
        });
    });

    describe('Manifest.json', () => {
        test('should have manifest.json file', () => {
            const manifestPath = path.join(__dirname, '../public/manifest.json');
            expect(fs.existsSync(manifestPath)).toBe(true);
            
            const content = fs.readFileSync(manifestPath, 'utf-8');
            const manifest = JSON.parse(content);
            
            expect(manifest.name).toBe('Mountain Taxes - State Income Tax Calculator');
            expect(manifest.short_name).toBe('Mountain Taxes');
            expect(manifest.start_url).toBe('/');
            expect(manifest.display).toBe('standalone');
            expect(manifest.theme_color).toBe('#a2e436');
        });

        test('should have proper icon definitions', () => {
            const manifestPath = path.join(__dirname, '../public/manifest.json');
            const content = fs.readFileSync(manifestPath, 'utf-8');
            const manifest = JSON.parse(content);
            
            expect(manifest.icons).toHaveLength(5);
            expect(manifest.icons[0].sizes).toBe('16x16');
            expect(manifest.icons[4].sizes).toBe('512x512');
        });
    });
});