

<!---
# (c) Copyright IBM Corp. 2025
--->

# Knowledge Pipeline – ZIP Functionality Overview

The **Knowledge Pipeline** provides a feature that allows you to **bundle all domain files** (either `.md`, `.pdf`, or both) into a single `.zip` archive. This archive can then be referenced in the **task file** for processing.


## Steps to Create a Valid Zip Archive

1. **Organize Files**  
   Place all the required domain files (`.md`, `.pdf`, etc.) into a dedicated folder.

2. **Create the Zip File**  
   Compress the folder into a `.zip` file using any standard zip tool.

3. **Do Not Rename the Zip File After Creation**  
   Important: Once the `.zip` file is created, **do not rename it**.  
   The name of the zip file must remain **exactly the same** when referenced in the task file.  
   Renaming causes mismatch errors.

4. **Reference in Task File**  
   Provide the **exact name** of the zip file in your task file configuration.

