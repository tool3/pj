import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const read: Function = promisify(fs.readFile);

export const generateId = (): string => {
    const characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength: number = characters.length;
    let result: string = '';

    for (var i = 0; i < 7; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const parseValues = (value: string): any => {
    if (value[0] === '[' || value[0] === '{') {
        return JSON.parse(value);
    } else if (value === "null") {
        return null;
    } else if (!isNaN(Number(value))) {
        return Number(value);
    } else if (value === "true" || value === "false") {
        return value === "true";
    } else {
        return value.replace(/['"]+/g, '');
    }
}

const formatQuery = (query: any): string => {
    const keys: string[] = Object.keys(query);
    const formattedQuery: any = keys.reduce((prev: any, key) => {
        const value = parseValues(query[key]);
        prev[key] = value;
        return prev;
    }, {});
    return JSON.stringify(formattedQuery, null, 2);
}

export const readHtml = async (query: any): Promise<string> => {
    const data: Buffer = await read(path.join(__dirname, '../public/template.html'));
    const html: string = data.toString();

    let className: string = "language-json";
    let theme: string = query.theme || 'twilight';
    if (query.showLineNumbers) {
        className += " line-numbers";
        delete query.showLineNumbers;
    }
    const formattedQuery: string = formatQuery(query);
    const formatted: string = html.replace("[REPLACE]", `<pre><code class=\"${className}\">${formattedQuery}</code></pre>`).replace("[THEME]", `prism-${theme}.min.css`);
    return formatted;
}
