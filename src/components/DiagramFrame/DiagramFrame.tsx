/*

 MIT License

 Copyright (c) 2020 Looker Data Sciences, Inc.

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.

 */

import React, { useCallback } from "react"
import {
  SpaceVertical,
  IconButton,
  Layout,
} from "@looker/components"
import { SelectionInfoPacket, VisibleViewLookup } from "../interfaces"
import { useCurrentModel } from "../../utils/routes"
import { DiagrammedModel, DiagramMetadata } from "../../utils/LookmlDiagrammer/"
import "./styles.css"
import {MetadataPanel} from "./MetadataPanel/MetadataPanel"
import { ViewOptions, DiagramSettings, HelpPanel, ExploreDropdown } from "./FramePanels"
import { DiagramHeader } from "./DiagramHeader"
import { DiagramCanvas } from "./DiagramCanvas/DiagramCanvas"
import { 
  ZOOM_INIT,
  X_INIT,
  Y_INIT,
  OVERRIDE_KEY,
  OVERRIDE_KEY_SUBTLE
} from '../../utils/constants'
import { ILookmlModelExplore } from "@looker/sdk/lib/sdk/4.0/models"
import {DiagramFrameProps} from "./types"
import {Rail, Stage} from "./FrameHelpers"
import { prepareModelDropdown } from "./utils"

export const DiagramFrame: React.FC<DiagramFrameProps> = ({
  unfilteredModels,
  pathModelName,
  pathExploreName,
  modelDetail,
  dimensions,
  modelError,
  setModelError,
  hiddenToggle,
  setHiddenToggle,
  displayFieldType,
  setDisplayFieldType,
  selectedBranch,
  setSelectedBranch,
  }) => {
  const [viewVisible, setViewVisible] = React.useState<VisibleViewLookup>({})
  const [showSettings, setShowSettings] = React.useState(true)
  const [showHelp, setShowHelp] = React.useState(false)
  const [showViewOptions, setShowViewOptions] = React.useState(false)
  const [showNoAside, setShowNoAside] = React.useState(false)
  const [reload, setReload] = React.useState(false)
  const [selectionInfo, setSelectionInfo] = React.useState<SelectionInfoPacket>({})
  const [zoomFactor, setZoomFactor] = React.useState(ZOOM_INIT)
  const [viewPosition, setViewPosition] = React.useState({x: X_INIT, y: Y_INIT})
  const [minimapEnabled, setMinimapEnabled] = React.useState(false)
  const [minimapUntoggled, setMinimapUntoggled] = React.useState(true)

  const handleHiddenToggle = useCallback((event: any) => setHiddenToggle(event.target.checked), [])

  function showDiagramFullPage() {
    setShowHelp(false)
    setShowViewOptions(false)
    setShowSettings(false)
    setShowNoAside(true)
  }

  function isDiagramFullPage() {
    showDiagramFullPage()
    return true
  }

  function toggleExploreInfo() {
    if (currentExplore && modelDetail) {
      let selectInfo = selectionInfo.lookmlElement !== "explore" ? {lookmlElement: "explore"} : {}
      setSelectionInfo(selectInfo)
    }
  }

  const onlyDiagramSelected = () => { return showNoAside && !showViewOptions && !showSettings && !showHelp ? true : undefined }

  const modelDetails = prepareModelDropdown(unfilteredModels)

  let currentExplore: ILookmlModelExplore = modelDetail?.explores.filter((d: ILookmlModelExplore)=>{
    return d.name === pathExploreName
  })[0]

  const currentDimensions: DiagrammedModel = dimensions?.filter((d: DiagrammedModel)=>{
    return d.exploreName === pathExploreName
  })[0]

  const currentDiagramMetadata: DiagramMetadata = currentDimensions?.diagramDict

  let defaultViews: VisibleViewLookup = {}
  Object.keys(viewVisible).length === 0 && currentExplore && currentDiagramMetadata && Object.keys(currentDiagramMetadata.tableData)
  .map((lookmlViewName: string)=>{
    defaultViews[lookmlViewName] = true
  })
  Object.keys(viewVisible).length === 0 && currentExplore && currentDiagramMetadata && setViewVisible(defaultViews)

  return (
    <Layout hasAside height="100%">
      <Rail width="50px">
        <SpaceVertical style={{alignItems: "center"}} alignItems="center" gap="xsmall">
          <IconButton
            icon="Dashboard"
            label="Diagram"
            tooltipPlacement="right"
            size="large"
            toggle={onlyDiagramSelected()}
            onClick={showDiagramFullPage}
            style={{color: onlyDiagramSelected() && OVERRIDE_KEY, 
              backgroundColor: onlyDiagramSelected() && OVERRIDE_KEY_SUBTLE,
              borderRadius: "10px"}}
          />
          <IconButton
            icon="GearOutline"
            label="Settings"
            tooltipPlacement="right"
            size="large"
            onClick={() => isDiagramFullPage() && setShowSettings(!showSettings)}
            toggle={showSettings}
            style={{color: showSettings && OVERRIDE_KEY, 
              backgroundColor: showSettings && OVERRIDE_KEY_SUBTLE,
              borderRadius: "10px"}}
          />
          <IconButton
            icon="Tune"
            label="View Options"
            tooltipPlacement="right"
            size="large"
            onClick={() => isDiagramFullPage() && setShowViewOptions(!showViewOptions)}
            toggle={showViewOptions}
            style={{color: showViewOptions && OVERRIDE_KEY, 
              backgroundColor: showViewOptions && OVERRIDE_KEY_SUBTLE,
              borderRadius: "10px"}}
          />
          <IconButton
            icon="Help"
            label="Diagram Help"
            tooltipPlacement="right"
            id="diagram-help-btn"
            size="large"
            onClick={() => isDiagramFullPage() && setShowHelp(!showHelp)}
            toggle={showHelp}
            style={{color: showHelp && OVERRIDE_KEY, 
              backgroundColor: showHelp && OVERRIDE_KEY_SUBTLE,
              borderRadius: "10px", position: "absolute", bottom: "0px"}}
          />
        </SpaceVertical>
      </Rail>
      {showSettings && (
        <DiagramSettings
          modelDetails={modelDetails}
          modelName={pathModelName}
          currentModel={modelDetail}
          setModelError={setModelError}
          setSelectedBranch={setSelectedBranch}
          selectionInfo={selectionInfo}
          currentExplore={currentExplore}
          diagramExplore={pathExploreName}
          setSelectionInfo={setSelectionInfo}
          setViewVisible={setViewVisible}
          setZoomFactor={setZoomFactor}
          setViewPosition={setViewPosition}
          setMinimapUntoggled={setMinimapUntoggled}
          setMinimapEnabled={setMinimapEnabled}
        />
      )}
      {showViewOptions && (
        <ViewOptions
          displayFieldType={displayFieldType}
          hiddenToggle={hiddenToggle}
          viewVisible={viewVisible}
          setViewVisible={setViewVisible}
          handleHiddenToggle={handleHiddenToggle}
          setDisplayFieldType={setDisplayFieldType}
        />
      )}
      {showHelp && (
        <HelpPanel
        />
      )}
      <Stage>
        <DiagramHeader
          currentExplore={currentExplore}
          selectionInfo={selectionInfo}
          toggleExploreInfo={toggleExploreInfo}
        />
        <Layout hasAside height="100%" id="DiagramStage">
        <DiagramCanvas
          unfilteredModels={unfilteredModels}
          modelError={modelError}
          pathModelName={pathModelName}
          pathExploreName={pathExploreName}
          currentDimensions={currentDimensions}
          zoomFactor={zoomFactor}
          reload={reload}
          minimapUntoggled={minimapUntoggled}
          minimapEnabled={minimapEnabled}
          setZoomFactor={setZoomFactor}
          setViewPosition={setViewPosition}
          setReload={setReload}
          setMinimapUntoggled={setMinimapUntoggled}
          setMinimapEnabled={setMinimapEnabled}
          dimensions={currentDiagramMetadata}
          explore={currentExplore}
          selectionInfo={selectionInfo}
          setSelectionInfo={setSelectionInfo}
          hiddenToggle={hiddenToggle}
          displayFieldType={displayFieldType}
          viewVisible={viewVisible}
          viewPosition={viewPosition}
          selectedBranch={selectedBranch}
        />
        {currentExplore && Object.keys(selectionInfo).length > 0 && (
          <MetadataPanel
            explore={currentExplore}
            selectionInfo={selectionInfo}
            model={modelDetail.model}
          />
        )}
        </Layout>
      </Stage>
      </Layout>
  )
}
