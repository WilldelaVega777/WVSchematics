//----------------------------------------------------------------------------------------
// Imports Section (Angular Devkit Schematics)
//----------------------------------------------------------------------------------------
import { Tree }                         from '@angular-devkit/schematics';
import { SchematicsException }          from '@angular-devkit/schematics';

//----------------------------------------------------------------------------------------
// Imports Section (External Libs)
//----------------------------------------------------------------------------------------
import * as ts                          from '../TypeScript/lib/typescript';


//----------------------------------------------------------------------------------------
// Utility Functions Section: readIntoSourceFile()
//----------------------------------------------------------------------------------------
export function readIntoSourceFile(host: Tree, modulePath: string): ts.SourceFile 
{
    const text = host.read(modulePath);

    if (text === null) 
    {
        throw new SchematicsException(`File ${modulePath} does not exist.`);
    }
    
    const sourceText = text.toString('utf-8');
    
    return ts.createSourceFile(modulePath, sourceText, ts.ScriptTarget.Latest, true);
}