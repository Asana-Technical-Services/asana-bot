import React, { useState, useEffect } from "react"
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import status from "/src/lib/status"
import colors from "/src/lib/colors"
import Button from "/src/components/button"
import Dropdown from "/src/components/dropdown"
import Icon from "/src/components/icon"
import axios from 'axios'
import useUser from "/src/lib/useUser";
import fetchJson from "/src/lib/fetchJson"
import { useRouter } from "next/router";

const sampleWebhook = {
  "data": {
    "filters": [
      {
        "action": "changed",
        "fields": [
          "assignee",
          "completed",
          "completed_by",
          "due_on",
          "dependencies",
          "custom_fields",
          "parent",
          "resource_subtype"
        ],
        "resource_type": "task"
      }
    ],
    "resource": "1130757427412039",
    "target": "https://asana-bot.vercel.app/api/webhooks"
  }
}

const WebhooksPage = () => {
  useEffect(() => {
    getWorkspaces()
  }, []);
  const { user, mutateUser } = useUser();
  const router = useRouter();
  const [workspaces, setWorkspaces] = useState([])
  const [selectedWorkspace, setSelectedWorkspace] = useState({})
  useEffect(() => {
    if (selectedWorkspace.gid) {
      getWebhooks()
    }
  }, [selectedWorkspace]);
  const [webhooks, setWebhooks] = useState([])
  const [newWebhook, setNewWebhook] = useState(sampleWebhook)
  const [selectedWebhook, setSelectedWebhook] = useState({})
  const [messageStatus, setMessageStatus] = useState(status.init)
  const [newWebhookStatus, setNewWebhookStatus] = useState(status.init)
  const [addPanel, setAddPanel] = useState(false)
  const [webhookPanel, setWebhookPanel] = useState(false)
  useEffect(() => {
    if (addPanel) {
      setNewWebhookStatus(status.init)
      setWebhookPanel(false)
    }
  }, [addPanel]);
  useEffect(() => {
    if (webhookPanel) {
      setAddPanel(false)
    }
  }, [webhookPanel]);
  // var newWebhookData = sampleWebhook
  const scrollToTop = () => {
    window.scrollTo(0, 0);
  }
  const confirmAdd = () => {
    if (window.confirm("Confirm you want to create a new webhook")) {
      addWebhook()
    }
  }
  const confirmDelete = (index) => {
    if (window.confirm("Confirm you want to delete webhook " + webhooks[index].gid)) {
      deleteWebhook(index)
    }
  }
  const addWebhook = () => {
    setNewWebhookStatus({
      value: status.values.active,
      message: "Creating webhook"
    })
    newWebhook.data.target = newWebhook.data.target + "?id=jha2j"
    axios({
      method: "POST",
      url: "https://app.asana.com/api/1.0/webhooks",
      headers: {
        Authorization: process.env.NEXT_PUBLIC_ASANA_TOKEN,
        "Content-Type": "application/json; charset=utf-8",
      },
      data: newWebhook
    }).then(res => {
      if (res.status === 201) {
        setNewWebhookStatus({
          value: status.values.completed,
          message: " webhook created"
        })
        getWebhooks()
      } else {
        setNewWebhookStatus({
          value: status.values.error,
          message: res.status + " Error - " + res.statusText
        })
      }
    }).catch(err => {
      setNewWebhookStatus({
        value: status.values.error,
        message: (err.response && err.response.statusText) ? err.response.statusText : err.message
      })
    })
  }
  const deleteWebhook = (index) => {
    scrollToTop()
    setMessageStatus({
      value: status.values.active,
      message: "Deleting webhook " + webhooks[index].gid
    })
    axios({
      method: "DELETE",
      url: "https://app.asana.com/api/1.0/webhooks/" + webhooks[index].gid,
      headers: {
        Authorization: process.env.NEXT_PUBLIC_ASANA_TOKEN,
        "Content-Type": "application/json; charset=utf-8",
      },
      data: newWebhook
    }).then(res => {
      if (res.status === 200) {
        setMessageStatus({
          value: status.values.completed,
          message: "Webhook " + webhooks[index].gid + " deleted"
        })
        var temp = [...webhooks];
        temp.splice(index, 1);
        setWebhooks(temp);
        // setMessageStatus({ value: status.values.completed })
      } else {
        setMessageStatus({
          value: status.values.error,
          message: res.status + " Error - " + res.statusText
        })
      }
    }).catch(err => {
      setMessageStatus({
        value: status.values.error,
        message: (err.response && err.response.statusText) ? err.response.statusText : err.message
      })
    })
  }
  const getWebhooks = () => {
    setMessageStatus({
      value: status.values.active,
      message: "Retrieving Webhooks"
    })
    setWebhooks([])
    axios({
      method: "GET",
      url: "https://app.asana.com/api/1.0/webhooks",
      params: {
        workspace: selectedWorkspace.gid
      },
      headers: {
        Authorization: process.env.NEXT_PUBLIC_ASANA_TOKEN,
        "Content-Type": "application/json; charset=utf-8",
      }
    }).then(res => {
      if (res.status === 200) {
        setWebhooks(res.data.data)
        setMessageStatus({
          value: status.values.completed,
          message: res.data.data.length + " webhooks retrieved"
        })
      } else {
        setMessageStatus({
          value: status.values.error,
          message: res.status + " Error - " + res.data
        })
      }
    }).catch(err => {
      console.log(err)
      setMessageStatus({
        value: status.values.error,
        message: err.message
      })
    })
  }
  const clearWebhooksStatus = () => {
    setMessageStatus({
      value: status.values.clear,
      message: ""
    })
  }
  const clearNewWebhookStatus = () => {
    setNewWebhookStatus({
      value: status.values.clear,
      message: ""
    })
  }
  const getWorkspaces = () => {
    setMessageStatus({
      value: status.values.active,
      message: "Retrieving Workspaces"
    })

    axios({
      method: "GET",
      url: "https://app.asana.com/api/1.0/workspaces",
      headers: {
        Authorization: process.env.NEXT_PUBLIC_ASANA_TOKEN,
        "Content-Type": "application/json; charset=utf-8",
      }
    }).then(res => {
      if (res.status === 200) {
        setWorkspaces(res.data.data)
        setMessageStatus({
          value: status.values.completed,
          message: res.data.data.length + " workspaces retrieved"
        })
        if (res.data.data.length > 0) {
          setSelectedWorkspace(res.data.data[0])
          // console.log(res.data.data[0])
          // getWebhooks()
        }
      } else {
        setMessageStatus({
          value: status.values.error,
          message: res.status + " Error - " + res.data
        })
      }
    }).catch(err => {
      setMessageStatus({
        value: status.values.error,
        message: err.message
      })
    })
  }
  const handleJSONInputChange = (e) => {
    setNewWebhook(e.jsObject)
  }
  const selectWebhook = (index) => {
    setSelectedWebhook(webhooks[index])
    setWebhookPanel(true)
  }
  const getPathFromUrl = (url) => {
    return url.split("?")[0].split("#")[0];
  }
  const renderWebhook = (data, index) => {
    const pillClass = "px-2 inline-flex text-xs leading-5 font-semibold rounded-full "
    let resourceColor = "gray"
    switch (data.resource.resource_type) {
      case "task":
        resourceColor = "pink"
        break
      case "project":
        resourceColor = "indigo"
        break
      case "portfolio":
        resourceColor = "purple"
        break
      default:
        break
    }
    const activeColor = data.resource.active ? "green" : "yellow"
    const resourcePillClass = pillClass + "bg-" + resourceColor + "-100 text-" + resourceColor + "-800"
    const statusPillClass = pillClass + "bg-" + activeColor + "-100 text-" + activeColor + "-800"
    return (
      <tr key="index">
        <td className="px-6 py-4 whitespace-nowrap">
          <a href="#" className="text-sm text-gray-500 hover:text-gray-700" onClick={() => selectWebhook(index)}>{data.gid}</a>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={resourcePillClass}>
            {data.resource.resource_type}
          </span>
          <div className="text-sm text-gray-500"></div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            {/* <div className="ml-4"> */}
            <div className="text-sm font-medium text-gray-900">
              {data.resource.name}
              {/* </div> */}
              <div className="text-sm font-light text-gray-400">
                {data.resource.gid}
              </div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-500">{getPathFromUrl(data.target)}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            Active
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <a href="#" className="text-red-500 hover:text-red-700" onClick={() => deleteWebhook(index)}>Delete</a>
        </td>
      </tr>
    )
  }
  const renderInput = (data, id, edit) => {
    return (
      <JSONInput
        id={id}
        placeholder={data}
        theme="dark_vscode_tribute"
        locale={locale}
        // height='300px'
        width='100%'
        onChange={handleJSONInputChange}
      />
    )
  }
  const toggleAddPanel = () => {
    setAddPanel(!addPanel)
  }
  const toggleWebhookPanel = () => {
    setWebhookPanel(!webhookPanel)
  }

  const logOut = () => {
    mutateUser(
      fetchJson("/api/logout", { method: "POST" }),
      false,
    );
    router.push("/");
  }

  const renderMessage = (statusMessage) => {
    const messageStatus = statusMessage.value
    const color = status.getColor(messageStatus)
    const topClass = "mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6"
    const subClass = "mt-2 flex items-center text-sm text-" + color + "-400"

    let messageIcon = "hash"
    switch (messageStatus) {
      case status.values.active:
        messageIcon = "clock"
        break;
      case status.values.error:
        messageIcon = "error"
        break;
      default:
        break;
    }

    return (
      <div className={topClass}>
        <div className={subClass}>
          {/* <Icon name={messageIcon} /> */}
          {statusMessage.message}
        </div>
      </div>
    )
  }
  const getWorkspacesNames = () => {
    let workspacesNames = []
    workspaces.map((workspace) => {
      workspacesNames.push(selectedWorkspace.name)
    })
    return workspacesNames
  }
  const selectWorkspace = (name) => {
    let workspaceResult = workspaces.find(workspaceItem => workspaceItem.name == name)
    if (workspaceResult.gid) {
      setSelectedWorkspace(workspaceResult)
    }
  }

  return (
    <div>
      {/* <Nav /> */}
      <div className="flex flex-row justify-between w-full">
        <div className="container mx-auto px-10">
          {/* <div className="lg:flex lg:items-center lg:justify-between"> */}
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0 py-20">
              <p className="text-2xl leading-7 text-gray-700 sm:text-3xl sm:truncate">
                Connected Webhooks
              </p>
              {renderMessage(messageStatus)}
            </div>
            <div className="mt-5 flex lg:mt-0 lg:ml-4">
              <Dropdown title={selectedWorkspace.gid ? selectedWorkspace.name : "Workspaces"} items={getWorkspacesNames()} action={(workspace) => { selectWorkspace(workspace) }} />
              <Button type={colors.button.action} text="Reload" icon="reload" action={() => getWebhooks()} />
              {!addPanel && (
                <Button type={colors.button.success} text="Add" icon="add" action={() => toggleAddPanel()} />
              )}
              <Button type={colors.button.secondary} text="Log out" icon="logout" action={() => logOut()} />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          GID
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Resource
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Target
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Edit</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {webhooks.map((webhook, index) => renderWebhook(webhook, index))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        {addPanel && (
          <aside className="bg-white shadow-md z-40 px-10 py-20 w-1/2 min-h-screen flex flex-col">
            <div className="flex justify-between py-3">
              <div className="">
                <Button type={colors.button.secondary} text="Close" icon="close" action={() => toggleAddPanel()} />
              </div>
              <p className="my-2 flex text-base font-medium text-gray-500">
                Create a new webhook
              </p>
            </div>
            <p className="mt-10 text-sm font-light text-gray-500">
              Complete the json bellow to <a href="https://developers.asana.com/docs/webhooks" target="_blank" className="link">create a new webhook</a> in the selected Asana workspace.
            </p>
            <div className="py-10">
              <JSONInput
                id="new-webhook"
                placeholder={newWebhook}
                theme="dark_vscode_tribute"
                locale={locale}
                // height='300px'
                width='100%'
                onChange={handleJSONInputChange}
              />
            </div>
            <div className="flex items-center justify-between mt-10">
              {renderMessage(newWebhookStatus)}
              <Button type={colors.button.success} text="Create" icon="check" action={() => addWebhook()} />
            </div>
          </aside>
        )}
        {webhookPanel && (
          <aside className="bg-white shadow-md z-40 px-10 py-20 w-1/2 min-h-screen flex flex-col">
            <div className="flex justify-between py-3">
              <div className="">
                <Button type={colors.button.secondary} text="Close" icon="close" action={() => toggleWebhookPanel()} />
              </div>
              <p className="my-2 flex text-base font-medium text-gray-500">
                Webhook {selectedWebhook.gid}
              </p>
            </div>
            <p className="mt-10 text-sm font-light text-gray-500">
              Validate that the webhook target is available <a href={selectedWebhook.target} target="_blank" className="link">here</a>. Reconnect if status is inactive.
            </p>
            <div className="py-10">
              <JSONInput
                id="webhook-data"
                placeholder={selectedWebhook}
                theme="dark_vscode_tribute"
                locale={locale}
                // height='300px'
                width='100%'
                viewOnly={true}
              />
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}

export default WebhooksPage