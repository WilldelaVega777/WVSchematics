//----------------------------------------------------------------------------------------
// Imports Section (Schematic Libraries)
//----------------------------------------------------------------------------------------
import { apply }                                from '@angular-devkit/schematics';
import { move }                                 from '@angular-devkit/schematics';
import { Rule }                                 from '@angular-devkit/schematics';
import { SchematicContext }                     from '@angular-devkit/schematics';
import { Tree }                                 from '@angular-devkit/schematics';
import { applyTemplates }                       from '@angular-devkit/schematics';
import { FileOperator }                         from '@angular-devkit/schematics';
import { mergeWith }                            from '@angular-devkit/schematics';
import { url }                                  from '@angular-devkit/schematics';
import { chain }                                from '@angular-devkit/schematics';
import { noop }                                 from '@angular-devkit/schematics';
import { filter }                               from '@angular-devkit/schematics';
import { forEach }                              from '@angular-devkit/schematics';
import { strings }                              from '@angular-devkit/core';

//----------------------------------------------------------------------------------------
// Imports Section (Utility Functions)
//----------------------------------------------------------------------------------------
import { applyLintFix }                         from '../lib/utility/lint-fix';
import { validateHtmlSelector }                 from '../lib/utility/validation';
import { validateName }                         from '../lib/utility/validation';
import { parseName }                            from '../lib/utility/parse-name';
import { findModuleFromOptions }                from '../lib/utility/find-module';
import { buildDefaultPath }                     from '../lib/utility/workspace';
import { getWorkspace }                         from '../lib/utility/workspace';

//----------------------------------------------------------------------------------------
// Imports Section (Higher Order Functions)
//----------------------------------------------------------------------------------------
import { addDeclarationToNgModule }             from '../lib/rule-utilities/addDeclarationToNgModule';
import { buildSelector }                        from '../lib/rule-utilities/buildSelector';

//----------------------------------------------------------------------------------------
// Imports Section (Local Type Definitions)
//----------------------------------------------------------------------------------------
import { ComponentSchema }                      from '../typings/wv/schemas/component-schema';


//----------------------------------------------------------------------------------------
// Rules Section (Rule for New Projects)
//----------------------------------------------------------------------------------------
export function newComponent(options: ComponentSchema) : Rule
{
    // Return Tree:
    return async (host: Tree, _context: SchematicContext) =>
    {
        const workspace   = await getWorkspace(host);
        const project     = workspace.projects.get(options.project as string);
    
        if (options.path === undefined && project) 
        {
          options.path    = buildDefaultPath(project);
        }
    
        options.module    = findModuleFromOptions(host, options);
    
        const parsedPath  = parseName(options.path as string, options.name);

        options.name      = parsedPath.name;
        options.path      = parsedPath.path;
        options.selector  = options.selector || buildSelector(options, project && project.prefix || '');
    
        validateName(options.name);
        validateHtmlSelector(options.selector);
    
        const templateSource = apply(
            url('../files/component'), 
            [
                options.skipTests      ? filter(path => !path.endsWith('.spec.ts.template'))     : noop(),
                options.inlineStyle    ? filter(path => !path.endsWith('.__style__.template'))   : noop(),
                options.inlineTemplate ? filter(path => !path.endsWith('.html.template'))        : noop(),
                applyTemplates({
                    ...strings,
                    'if-flat': (s: string) => options.flat ? '' : s,
                    ...options,
                }),

                !options.type ? forEach(
                    (
                        file => 
                        {
                            if (!!file.path.match(new RegExp('..'))) {
                                return {
                                content: file.content,
                                path: file.path.replace('..', '.'),
                                };
                            } else {
                                return file;
                            }
                        }
                    ) as FileOperator
                ) : noop(),
                move(parsedPath.path)
            ]
        );
    
        return chain([
            addDeclarationToNgModule(options),
            mergeWith(templateSource),
            options.lintFix ? applyLintFix(options.path) : noop(),
        ]);
    };
}