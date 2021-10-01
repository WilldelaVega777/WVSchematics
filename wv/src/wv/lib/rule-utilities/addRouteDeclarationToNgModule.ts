//----------------------------------------------------------------------------------------
// Imports Section (Angular Devkit Schematics)
//----------------------------------------------------------------------------------------
import { Path }                         from '@angular-devkit/core';
import { Rule }                         from '@angular-devkit/schematics';
import { Tree }                         from '@angular-devkit/schematics';

//----------------------------------------------------------------------------------------
// Imports Section (TypeScript)
//----------------------------------------------------------------------------------------
import * as ts                          from '../TypeScript/lib/typescript';

//----------------------------------------------------------------------------------------
// Imports Section (Schematic Utilities)
//----------------------------------------------------------------------------------------
import { InsertChange }                 from '../utility/change';
import { addRouteDeclarationToModule }  from '../utility/ast-utils';

//----------------------------------------------------------------------------------------
// Imports Section (Higher Order Functions)
//----------------------------------------------------------------------------------------
import { buildRoute }                   from './buildRoute';

//----------------------------------------------------------------------------------------
// Imports Section (Local Type Definitions)
//----------------------------------------------------------------------------------------
import { ModuleSchema }                 from '../../typings/wv/schemas/module-schema';


//----------------------------------------------------------------------------------------
// Utility Functions Section: addDeclarationToNgModule()
//----------------------------------------------------------------------------------------
export function addRouteDeclarationToNgModule(
    options: ModuleSchema,
    routingModulePath: Path | undefined,
): Rule 
{
    return (host: Tree) => 
    {
        if (!options.route)
        {
            return host;
        }

        if (!options.module) 
        {
            throw new Error('Module option required when creating a lazy loaded routing module.');
        }
    
        let path: string;
        
        if (routingModulePath) 
        {
            path = routingModulePath;
        } 
        else 
        {
            path = options.module;
        }
    
        const text = host.read(path);

        if (!text) 
        {
            throw new Error(`Couldn't find the module nor its routing module.`);
        }
    
        const sourceText = text.toString();
        
        const addDeclaration = addRouteDeclarationToModule(
            ts.createSourceFile(path, sourceText, ts.ScriptTarget.Latest, true),
            path,
            buildRoute(options, options.module),
        ) as InsertChange;
    
        const recorder = host.beginUpdate(path);

        recorder.insertLeft(addDeclaration.pos, addDeclaration.toAdd);

        host.commitUpdate(recorder);
    
        return host;
    };
}