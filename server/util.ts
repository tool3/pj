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

const formatJsonQuery = (query: any): string => {
    const keys: string[] = Object.keys(query);
    const formattedQuery: any = keys.reduce((prev: any, key) => {
        const value = parseValues(query[key]);
        prev[key] = value;
        return prev;
    }, {});
    return JSON.stringify(formattedQuery, null, 2);
}

const formatJsQuery = (query: any) => {
    let result = '';
    let code = query.code;
    const outcome = code.split(" ").reduce((prev, next) => {
        console.log(next);
        if (next === "{") {
            next = "{\n\t";
        }

        if (next === "}") {
            next = "\n}\n";
        }

        if (next === "##") {
            next = "\n";
        }

        prev.push(next);
        return prev;
    }, []).join(' ');

    for (let char = 1; char < code.length - 1; char++) {

        if (code[char] === "}") {
            result += "\n";
        }

        result += code[char];

        if (code[char] === "{") {
            result += "\n\t";
        }

        if (code[char] === "__") {
            result += "\n";
        }
    }
    console.log(outcome);
    return result;
};

export const readHtml = async (query: any, language: string): Promise<string> => {
    const data: Buffer = await read(path.join(__dirname, '../public/template.html'));
    const html: string = data.toString();

    let theme: string = 'okaidia';
    let className: string = `language-${language}`;
    if (query.theme) {
        theme = query.theme;
        delete query.theme;
    }

    if (query.showLineNumbers) {
        className += " line-numbers";
        delete query.showLineNumbers;
    }

    const formattedQuery: string = language === "json" ? formatJsonQuery(query) : formatJsQuery(query);
    const formatted: string = html.replace("[REPLACE]", `<pre><code class=\"${className}\">${formattedQuery}</code></pre>`).replace("[THEME]", `prism-${theme}.min.css`);
    return formatted;
}
