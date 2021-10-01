//----------------------------------------------------------------------------------------
// Imports Section (Angular Devkit Core)
//----------------------------------------------------------------------------------------
import { strings }                      from '@angular-devkit/core';

//----------------------------------------------------------------------------------------
// Imports Section (Angular Devkit Schematics)
//----------------------------------------------------------------------------------------
import { Rule }                         from '@angular-devkit/schematics';
import { Tree }                         from '@angular-devkit/schematics';

//----------------------------------------------------------------------------------------
// Imports Section (Rule Utilities)
//----------------------------------------------------------------------------------------
import { readIntoSourceFile }           from './readIntoSourceFile';

//----------------------------------------------------------------------------------------
// Imports Section (Local Type Definitions)
//----------------------------------------------------------------------------------------
import { ViewSchema }                   from '../../typings/wv/schemas/view-schema';

//----------------------------------------------------------------------------------------
// Imports Section (Schematic Utilities)
//----------------------------------------------------------------------------------------
import { buildRelativePath }            from '../utility/find-module';
import { InsertChange }                 from '../utility/change';

import { addDeclarationToModule }       from '../utility/ast-utils';
import { addEntryComponentToModule }    from '../utility/ast-utils';
import { addExportToModule }            from '../utility/ast-utils';


//----------------------------------------------------------------------------------------
// Utility Functions Section: addDeclarationToNgModule()
//----------------------------------------------------------------------------------------
export function addDeclarationToNgModule(options: ViewSchema): Rule 
{
    return (host: Tree) => {

        if (options.skipImport || !options.module) 
        {
            return host;
        }
    
        options.type = (options.type != null ? options.type : 'Component');
    
        const modulePath = options.module;
        
        const source = readIntoSourceFile(host, modulePath);
    
        const componentPath = `/${options.path}/`
                            + (options.flat ? '' : strings.dasherize(options.name) + '/')
                            + strings.dasherize(options.name)
                            + (options.type ? '.' : '')
                            + strings.dasherize(options.type);

        const relativePath   = buildRelativePath(modulePath, componentPath);
        const classifiedName = strings.classify(options.name) + strings.classify(options.type);

        const declarationChanges = addDeclarationToModule(source,
                                                        modulePath,
                                                        classifiedName,
                                                        relativePath);
                                                        
        const declarationRecorder = host.beginUpdate(modulePath);

        for (const change of declarationChanges) 
        {
            if (change instanceof InsertChange) 
            {
                declarationRecorder.insertLeft(change.pos, change.toAdd);
            }
        }

        host.commitUpdate(declarationRecorder);
    
        if (options.export) 
        {
            // Need to refresh the AST because we overwrote the file in the host.
            const source = readIntoSourceFile(host, modulePath);
        
            const exportRecorder = host.beginUpdate(modulePath);
            const exportChanges = addExportToModule(source, modulePath,
                                                    strings.classify(options.name) + strings.classify(options.type),
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
    
        if (options.entryComponent) 
        {
            // Need to refresh the AST because we overwrote the file in the host.
            const source = readIntoSourceFile(host, modulePath);
        
            const entryComponentRecorder = host.beginUpdate(modulePath);

            const entryComponentChanges = addEntryComponentToModule(
                source, modulePath,
                strings.classify(options.name) + strings.classify(options.type),
                relativePath
            );
        
            for (const change of entryComponentChanges) 
            {
                if (change instanceof InsertChange) 
                {
                    entryComponentRecorder.insertLeft(change.pos, change.toAdd);
                }
            }

            host.commitUpdate(entryComponentRecorder);
        }
    
        return host;
    };
}
