using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[System.Serializable]
public class GameAccount
{
    public string _id;
    public int permission;
    public string username;
    public bool active;

    public void Load(string jsonString)
    {
        JsonUtility.FromJsonOverwrite(jsonString, this);
    }
}
