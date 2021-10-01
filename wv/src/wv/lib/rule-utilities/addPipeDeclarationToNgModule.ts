//----------------------------------------------------------------------------------------
// Imports Section (Angular Devkit Core)
//----------------------------------------------------------------------------------------
import { strings }                      from '@angular-devkit/core';

//----------------------------------------------------------------------------------------
// Imports Section (Angular Devkit Schematics)
//----------------------------------------------------------------------------------------
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
import { buildRelativePath }            from '../utility/find-module';
import { InsertChange }                 from '../utility/change';
import { addDeclarationToModule }       from '../utility/ast-utils';
import { addExportToModule }            from '../utility/ast-utils';


//----------------------------------------------------------------------------------------
// Imports Section (Local Type Definitions)
//----------------------------------------------------------------------------------------
import { PipeSchema }                           from '../../typings/wv/schemas/pipe-schema';


//----------------------------------------------------------------------------------------
// Utility Functions Section: addDeclarationToNgModule()
//----------------------------------------------------------------------------------------
export function addPipeDeclarationToNgModule(options: PipeSchema): Rule 
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

        const sourceText = text.toString('utf-8');
        const source = ts.createSourceFile(modulePath, sourceText, ts.ScriptTarget.Latest, true);
    
        const pipePath = `/${options.path}/`
                        + strings.dasherize(options.name)
                        + '.pipe';

        const relativePath = buildRelativePath(modulePath, pipePath);
        const changes = addDeclarationToModule(source, modulePath,
                                                strings.classify(`${options.name}Pipe`),
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
    
        if (options.export) 
        {
            const text = host.read(modulePath);
        
            if (text === null) 
            {
                throw new SchematicsException(`File ${modulePath} does not exist.`);
            }

            const sourceText = text.toString('utf-8');
            const source = ts.createSourceFile(modulePath, sourceText, ts.ScriptTarget.Latest, true);
        
            const exportRecorder = host.beginUpdate(modulePath);
            const exportChanges = addExportToModule(source, modulePath,
                                                    strings.classify(`${options.name}Pipe`),
                                                    relativePath);
        
            for (const change of exportChanges) 
            {
                if (change instanceof InsertChange) 
                {
                    exportRecorder.insertLeft(change.pos, change.toAdd);
                }
            }

            host.commitUpdate(exportRecorder);
        }
    
        return host;
    };
}