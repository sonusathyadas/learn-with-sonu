
# Buildpacks 

## What is a buildpack?

A buildpack is a tool that is used to transform your source code into a application image. Its primary job is to identify the dependencies required to build and run the project. 

The auto-detection process in the buildpack detects the matching buildpack for the application source code. It runs a group of buildpacks sequentially against the application source code and the first group that deems itself fit for the source code will be choosen as the selected set of buildpack for that source code.  The detection process depends on the project type: for example for `Node` projects it looks for the `package.json` file. 

## Cloud native buildpacks

The `Cloud Native Buildpacks` project was initiated by `Pivotal` and `Heroku` in January 2018 and joined the `Cloud Native Computing Foundation` in October 2018. This project aims at building production grade buildpacks for applications. `Cloud Native Buildpacks` follows modern container standards, such as the `OCI image format`. They take advantage of the latest capabilities of these standards, such as cross-repository blob mounting and image layer "rebasing" on Docker API v2 registries.

To run a build process using buildpacks in your system you need to install `Docker` and `Pack` in your system. `Pack` is a tool maintained by the Cloud Native Buildpacks project to support the use of buildpacks.

It enables the following functionality:

* `build` an application using buildpacks.
* `rebase` application images created using buildpacks.
* Creation of various `components` used within the ecosystem.

Pack works as both a `Command Line Interface (CLI)` and a `Go library`.

To install pack on `Windows`, use the `chocolatey` package manager :
    
```bash
choco install pack --version=0.29.0    
```

`Buildpacks` examines the source code of your application and detects all dependencies required to run on any cloud. It provides the framework and runtime support for running applications on various cloud environments. 

![Buildpacks](./assets/markdown/buildpacks/images/image1.svg)

## How the buildpacks works?

Every buildpack process contains two phases - a `detect` phase and a `build` phase. 

### **Detect phase**
The `detect` phase is used to detect the buildpack applicable to the project source code. It runs group of buildpacks against the source code  and detects the applicable one. After the applicable `buildpack` is detected it executes the `build` phase. The `build` phase is ignored if no matching buildpack is detected. 
The detection phase uses different criterias to detect the matching buildpack. For example, if it is a `Python` project, it looks for `requirements.txt` or `setup.py` file. If it is a `Node` project, it look for `package.json` or `package-lock.json` files.

### **Build phase**
The `build` phase is executed against the source codes to set the runtime environment and dependencies for the application. It download all dependencies and compile the code to detect build errors. Then it identifies the `entrypoint` and `startup scripts` for the project. If the project is detected as a `Python` project it executes `pip install -r requirements.txt` command to install all packages. If it is a `Node` project it runs `npm install` command to install all `npm` packages.

![Buildpack phases](./assets/markdown/buildpacks/images/image2.svg)

## Components of Cloud Native Buildpacks

The following are the components of  cloud native buildpacks:

### **Builder**

A `builder` is required to build an image. A builder is an `image` that contains the necessary components to execute a build process. A builder image is created using a base image and adding lifecycles, buildpacks and other files that is used to configure the build process such as order of buildpack detection and location of the run image.

A builder consists of the following components:

* Buildpacks
* Lifecycle
* Stack’s build image


![builder-create](./assets/markdown/buildpacks/images/create-builder.svg)

### **Buildpacks** 

A buildpack analyses the source code and identifies the correct set of buildpack to build and run the application. It contains a set of executables for analysing the source code. Generally every buildpack contains the three files. They are:

* `buildpack.toml` 
    This file contains the metadata information about the buildpack such as `id`, `name` , `version` etc.
    ```yaml
    api = "0.2"

    [buildpack]
      id = "demo-dotnet-buildpack"
      version = "1.1.0"
      name = ".NET Buildpack for Sample App"
    
    [[stacks]]
      id = "io.buildpacks.samples.stacks.dotnet-framework-1809"
    
    [[stacks]]
      id = "io.buildpacks.samples.stacks.dotnet-framework-2004"
    
    [[stacks]]
      id = "io.buildpacks.samples.stacks.dotnet-framework-2022"
    ```
* `bin/detect or bin/detect.bat ` 
    This file is an executable used to determine whether buildpack should be applied for the source code or not. It analyzes the source code and determine which buildpack can be applied.
* `bin/build or bin/build.bat` 
    This executable is used to build the application. This contains the steps to build the application. 


`Meta-buildpacks` are another types of buildpacks that only contains the `buildpack.toml` file. This contain the references to other buildpacks and suitable to define complex detection strategies.

### **Buildpack groups**
A buildpack group is a list of buildpack entries defined in the order in which they will run.Because buildpacks are modular and reusable, a buildpack group allows us to connect multiple modular buildpacks together. Eg: A Java installer buildpack and a maven builder buildpack can be combined to create a Java build tool.

A buildpack entry is identified by an id and a version. It may also be marked as optional. There can be one or more buildpacks in a buildpack group. A builder or meta-buildpack may contain multiple buildpack groups. 

### Detection process with buildpack groups:
1) When the lifecycle executes the detection process, it will process each buildpack group it finds in the order that the groups are specified. 

2) For each buildpack group, the lifecycle will execute the detect phase of all buildpacks in that group (these can be executed in parallel) and aggregate the results. 
    
3) The lifecycle will select the first buildpack group by order where all of the non-optional buildpacks in that group pass detection.


### **Lifecycle**

The lifecycle of the buildpacks execution contains many stages. Each stage artifact is combined to generate the final app image. The following lifecycle stages are there in the buildpack orchestration:

* **Analyse**
    
    The analyze phase is used to determine which of the layers can be reused in the build and export phases. It will optimize the process of `build` and `export`. In older APIs (prior to 0.7), the `analyer` was responsible to analyse the metadata from cache or the previously build images to understand which images can be reused in the `export` phase. From version 0.7 onwards, analyser executes before `detect` phase to determine the registry access permission for all images. This helps to determine the errors before start building the image. 

* **Detect**

    This is the first phase of the lifecycle. The `detector` determines which buildpack is appropariate for the source code from a set of `buildpacks`. The `detector` does not takes any arguments and does not require any root privileges. It uses the `order.toml` as the input file and outputs `group.tml` and `plan.toml`. The  `order.toml` contains the list of groups and each group contains the information about a set of buildpacks. 

    * **order.toml**: The `detector` uses the `order.toml` to find out the first group that passes the detection process. It goes through each group to detect the matching set f buildpack. If all groups fails then the detection process fails. In order to pass the detection process, the `detect` scripts of all required buildpacks must pass successfully (the exit code is zero) and the `detector` should be able to create a build plan (`plan.toml`) with all of the requirements of the group’s buildpacks. The first group that passes both steps is written to `group.toml` and its build plan is written to `plan.toml`.

    * **group.toml**: Created by the detector when a group of buildpacks pass the detection process and able to create the `plan.toml` file. It stores the information about the group which pass the detection process.

    * **plan.toml**: The `detector` creates this file with all dependencies required to build the image. 

* **Restore**
    
    This phase of lifecycle is used to restore the reusable layers from the cache if available.

* **Build**
    
    The build phase transforms th source code into app image. 

* **Export**

    This stage creates the OCI image of the application. This creates the image into a container registry or to the docker daemon based on the tag value provided as an argument. This will generate a `report.toml` file that contains the image manifest information.

* **Create**
    
    Runs analyse, detect, restore, build, and export in a single command.

* **Launch**

    The entrypoint for the final OCI image. Responsible for launching application processes. 

* **Rebase**

    Rebase application layers onto a new run image. 

### **Platform**

A platform uses a `lifecycle`, `buildpacks (packaged in a builder)`, and `application source code` to produce an OCI image.

Examples of a platform might include:
* A local CLI tool that uses buildpacks to create OCI images. One such tool is the `Pack CLI`
* A plugin for a continuous integration service that uses buildpacks to create OCI images. One such plugin is the buildpacks plugin in `Tekton`
* A cloud application platform that uses buildpacks to build source code before deployment. One such platform is `kpack`

### **Stack**

A stack is composed of two images that are intended to work together:

* The `build image` of a stack provides the base image from which the build environment is constructed. The build environment is the containerized environment in which the lifecycle (and thereby buildpacks) are executed.
* The `run image` of a stack provides the base image from which application images are built.

`pack stack suggest` will display a list of recommended stacks that can be used when running `pack builder create`, along with each stack’s associated build and run images.


## How can i build images using buildpacks

1) Buildpacks can be used to created images using a command line interface - Pack CLI.
2) A CI/CD plugin for buildpacks can be used to build images. 

    ![Buildpacks CICD plugin](./assets/markdown/buildpacks/images/3_Buildpacks_search.PNG)

3) A cloud application platform that uses buildpacks to build source code before deployment. eg: `kpack`
    
## Build images and run images

Buildpacks are compatible with one or more stacks. A stack contains a `build image` and a `run image`. The `build image` acts as the environment for the build process when the buildpacks are executed and the `run image` is used as the base image for the final container image.  A `builder image` consists of a `build image` and one or more set of build packs with its lifecycle.

![Build image vs Base image](./assets/markdown/buildpacks/images/build.svg)

Developers can update the app image without rebuilding the entire app image. This can be achieved by `rebasing`. With `rebasing` developer can replace the `run image` of the existing app image with a `new run image` without rebuilding it. By inspecting the app image, the `rebase` can identify whether a new `run image` is available for the app image. It check the existence of the new image in the local repository or registry. 

```bash
pack rebase image-name:tag
```

`pack rebase` has a `--publish` flag that can be used to publish the updated app image directly to a registry. 

![Build image vs Base image](./assets/markdown/buildpacks/images/rebase.svg)

## Build images for ExpressJS application using Pack CLI

1) Pack command can suggest the available list of builders when running the following command.
    
    ```bash
    pack builder suggest
    ```

2) You can set a `builder` as the default builder for the `pack build` command. If you set a default builder, then you dont need to pass the `--builder` parameter when running the `pack build` command.

    ```bash
    pack config default-builder  <builder-name>
    ```
    
3) To build an image from the application source code, we can use the `express-sample-web` from the `Demos` directory. Open the command terminal in the `express-sample-web` directory and restore the node package using the following command.

    ```bash
    npm install
    ```

4) Build the application and publish the output to the `dist` directory using the command given below:
    
    ```bash
    npm run build
    ```

5) Before you build the image of the application using `pack build` command, you can delete the `node_modules` directory to avoid copying it to the image.

6) Run the following command to build the image:
    
    ```bash
    pack build bookstore-web:latest
    ```

7) After the image is being built, run the following command to run the docker image.
    
    ```bash
    docker run --rm --name app1 -d -p 8080:8080 bookstore-web:latest
    ```

## Build python flask application using Pack CLI

1) To build an image for the Python flask application, we can use the `flask-sample-web` from the `Demos` directory. Open the command terminal in the `flask-sample-web` directory. Create a virtual environment.

    ```bash
    python -m venv venv
    ```
2) Activate the virtual environment.
    
    ```bash
    ./venv/Scripts/Activate
    ```

3) Restore the packages using the following command.

    ```bash
    pip install 
    ```

4) We are using `gunicorn` to run the application in the production server. The `Procfile` contains a startup script for the `buildpack` image.

    ```
    web: gunicorn --bind=0.0.0.0:8080 app:app
    ```

5) Run the following command to build the image:
    
    ```bash
    pack build flask-web:latest
    ```

7) After the image is being built, run the following command to run the docker image.
    
    ```bash
    docker run --rm --name app1 -d -p 8080:8080 flask-web:latest
    ```

## Build images for .NET Core application using Pack CLI

1) To build image for `dotnet core ` application, we can use the `DotnetSampleApp` from the `Demos` folder. Open the Command Terminal in the `DotnetSampleApp` directory.

2) We need to use a custom builder to build `dotnet core ` application. Run the following command to build the image.

    ```bash
    pack build sample-dotnet-web:latest --builder paketobuildpacks/builder:base
    ```
    We can optionally specify the buildpack name as an argument.
    
    ```bash
     pack build sample-dotnet-web:latest --buildpack paketo-buildpacks/dotnet-core --builder paketobuildpacks/builder:base
    ```

3) This will use a custom builder image and creates the .net core application image. Run the image using `docker run` command.

    ```bash
    docker run -it --name app1 --rm -p 8080:8080 sample-dotnet-web:latest
    ```

