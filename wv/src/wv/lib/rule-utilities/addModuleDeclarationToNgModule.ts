//----------------------------------------------------------------------------------------
// Imports Section (Angular Devkit Schematics)
//----------------------------------------------------------------------------------------
import { strings }                      from '@angular-devkit/core';
import { Rule }                         from '@angular-devkit/schematics';
import { Tree }                         from '@angular-devkit/schematics';
import { SchematicsException }          from '@angular-devkit/schematics';

//----------------------------------------------------------------------------------------
// Imports Section (TypeScript)
//----------------------------------------------------------------------------------------
import * as ts                          from '../TypeScript/lib/typescript';

//----------------------------------------------------------------------------------------
// Imports Section (Schematic Utilities)
//----------------------------------------------------------------------------------------
import { InsertChange }                 from '../utility/change';
import { addImportToModule }            from '../utility/ast-utils';

//----------------------------------------------------------------------------------------
// Imports Section (Higher Order Functions)
//----------------------------------------------------------------------------------------
import { buildRelativeModulePath }      from './buildRelativeModulePath';


//----------------------------------------------------------------------------------------
// Imports Section (Local Type Definitions)
//----------------------------------------------------------------------------------------
import { ModuleSchema }                  from '../../typings/wv/schemas/module-schema';


//----------------------------------------------------------------------------------------
// Utility Functions Section: addDeclarationToNgModule()
//----------------------------------------------------------------------------------------
export function addModuleDeclarationToNgModule(options: ModuleSchema): Rule 
{
    return (host: Tree) => 
    {
        if (!options.module) 
        {
            return host;
        }
    
        const modulePath = options.module;
    
        const text = host.read(modulePath);
        
        if (text === null) 
        {
            throw new SchematicsException(`File ${modulePath} does not exist.`);
        }

        const sourceText = text.toString();
        const source = ts.createSourceFile(modulePath, sourceText, ts.ScriptTarget.Latest, true);
    
        const relativePath = buildRelativeModulePath(options, modulePath);
        
        const changes = addImportToModule(source,
                                        modulePath,
                                        strings.classify(`${options.name}Module`),
                                        relativePath);
    
        const recorder = host.beginUpdate(modulePath);
        
        for (const change of changes) 
        {
            if (change instanceof InsertChange) 
            {
                recorder.insertLeft(change.pos, change.toAdd);
            }
        }
        
        host.commitUpdate(recorder);
    
        return host;
    };
}